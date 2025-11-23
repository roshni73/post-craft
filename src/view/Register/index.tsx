import { useNavigate, Link } from 'react-router-dom';
import { Loader2, BookOpen } from 'lucide-react';

import { useFormValidation } from '@/hooks/useFormValidation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/Card';
import { Label } from '@/Components/Label';
import { Input } from '@/Components/Input';
import { Button } from '@/Components/Button';
import { Alert, AlertDescription } from '@/Components/Alert';
import * as yup from 'yup';
import { useAuth } from '@/hooks/useAuth';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  [key: string]: unknown;
}

const registerSchema = yup.object({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),

  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .matches(/^\S+@\S+\.\S+$/, 'Email must be a valid format'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),

  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const {
    values: formData,
    loading,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    setSubmitError,
  } = useFormValidation<RegisterFormData>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values: RegisterFormData) => {
      await register(values.name, values.email, values.password);
      setSubmitError('');
      navigate('/login', {
        state: {
          message: 'Registration successful! Please login to continue.',
        },
        replace: true,
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <BookOpen className="size-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Sign up to start creating blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name as string}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                disabled={loading}
                className={getFieldError('name') ? 'border-red-500 focus:border-red-500' : ''}
              />
              {getFieldError('name') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('name')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email as string}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                disabled={loading}
                className={getFieldError('email') ? 'border-red-500 focus:border-red-500' : ''}
              />
              {getFieldError('email') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('email')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={formData.password as string}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                disabled={loading}
                className={getFieldError('password') ? 'border-red-500 focus:border-red-500' : ''}
              />
              {getFieldError('password') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('password')}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 6 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="confirm Password"
                value={formData.confirmPassword as string}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                disabled={loading}
                className={
                  getFieldError('confirmPassword') ? 'border-red-500 focus:border-red-500' : ''
                }
              />
              {getFieldError('confirmPassword') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('confirmPassword')}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>

            <div className="text-center">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
