import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Loader2, BookOpen, CheckCircle2 } from 'lucide-react';
import * as yup from 'yup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/Card';
import { Alert, AlertDescription } from '@/Components/Alert';
import { Label } from '@/Components/Label';
import { Input } from '@/Components/Input';
import { Button } from '@/Components/Button';

interface LoginFormData {
  email: string;
  password: string;
  [key: string]: unknown;
}

const loginSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    values: formData,
    loading,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = useFormValidation<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values: LoginFormData) => {
      await login(values.email, values.password);
      navigate('/dashboard');
    },
  });

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <BookOpen className="size-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {successMessage && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

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
                placeholder="••••••••"
                value={formData.password as string}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                disabled={loading}
                className={getFieldError('password') ? 'border-red-500 focus:border-red-500' : ''}
              />
              {getFieldError('password') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('password')}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Hint: Use any email and password (min 6 characters)
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="text-center">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
