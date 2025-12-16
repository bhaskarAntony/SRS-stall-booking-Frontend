import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-md">
        {/* Logo / heading */}
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-sky-500 text-white text-lg font-bold">
            S
          </div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            Sign in to SRS Stall Booking
          </h1>
          <p className="mt-1 text-[12px] text-slate-500">
            Use your email and password to continue.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 sm:px-5 py-4 sm:py-5 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-700"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4 text-slate-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed hover:from-orange-600 hover:to-sky-600"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-[12px] text-slate-500">
              Do not have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-orange-600 hover:text-orange-700"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Sub footer text */}
        <p className="mt-4 text-center text-[11px] text-slate-400">
          By continuing, you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
