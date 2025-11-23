import { useState } from 'react';
import * as yup from 'yup';

type FormValues = Record<string, unknown>;

interface UseFormValidationProps<T extends FormValues> {
  initialValues: T;
  validationSchema: yup.ObjectSchema<T>;
  onSubmit: (values: T) => Promise<void>;
}

export function useFormValidation<T extends FormValues>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormValidationProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = async <K extends keyof T>(field: K) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    try {
      await validationSchema.validateAt(field as string, values);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [field]: error.message }));
      }
    }
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            // Safely cast the path to keyof T since we know it's a key of our form values
            const fieldName = err.path as keyof T;
            newErrors[fieldName] = err.message;
          }
        });
        setErrors(newErrors);

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce(
          (acc, key) => {
            acc[key as keyof T] = true;
            return acc;
          },
          {} as Partial<Record<keyof T, boolean>>
        );
        setTouched(allTouched);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);
    try {
      await onSubmit(values);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: keyof T): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError('');
  };

  // Set specific field value
  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  // Set specific field error
  const setFieldError = (field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return {
    values,
    errors,
    touched,
    loading,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    resetForm,
    setFieldValue,
    setFieldError,
    setSubmitError,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0,
  };
}
