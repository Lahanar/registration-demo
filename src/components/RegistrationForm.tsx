import { useState } from 'react';
import { UserPlus, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { validateEmail, validatePassword, validatePasswordsMatch } from '../utils/validation';
import type { RegisterRequest, RegisterResponse, ValidationError } from '../types/registration';

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<RegisterResponse | null>(null);

  const validateForm = (): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    if (!formData.email.trim()) {
      newErrors.push({ field: 'email', message: 'Email is required' });
    } else if (!validateEmail(formData.email)) {
      newErrors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (!formData.password) {
      newErrors.push({ field: 'password', message: 'Password is required' });
    } else if (!validatePassword(formData.password)) {
      newErrors.push({ field: 'password', message: 'Password must be at least 8 characters' });
    }

    if (!formData.confirmPassword) {
      newErrors.push({ field: 'confirmPassword', message: 'Please confirm your password' });
    } else if (!validatePasswordsMatch(formData.password, formData.confirmPassword)) {
      newErrors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessData(null);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/register`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors([{ field: 'general', message: data.error || 'Registration failed' }]);
        return;
      }

      setSuccessData(data as RegisterResponse);
      setFormData({ email: '', password: '', confirmPassword: '' });
    } catch (error) {
      setErrors([{ field: 'general', message: 'Network error. Please try again.' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const generalError = errors.find(error => error.field === 'general')?.message;

  if (successData) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your account has been created successfully.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 w-full mb-6">
              <p className="text-sm text-gray-500 mb-1">User ID</p>
              <p className="font-mono text-sm text-gray-900 break-all">{successData.id}</p>
              <p className="text-sm text-gray-500 mt-3 mb-1">Email</p>
              <p className="font-medium text-gray-900">{successData.email}</p>
            </div>
            <button
              onClick={() => setSuccessData(null)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Register another account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Create Account</h1>
        <p className="text-gray-600 text-center mb-8">Sign up to get started</p>

        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  getFieldError('email') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
            </div>
            {getFieldError('email') && (
              <p className="mt-2 text-sm text-red-600">{getFieldError('email')}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  getFieldError('password') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Minimum 8 characters"
                disabled={isSubmitting}
              />
            </div>
            {getFieldError('password') && (
              <p className="mt-2 text-sm text-red-600">{getFieldError('password')}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  getFieldError('confirmPassword') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Re-enter your password"
                disabled={isSubmitting}
              />
            </div>
            {getFieldError('confirmPassword') && (
              <p className="mt-2 text-sm text-red-600">{getFieldError('confirmPassword')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-600/30"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
