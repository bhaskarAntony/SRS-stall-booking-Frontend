import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {register, isLoading } = useAuthStore();
const {login, loading, saveAuth} = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const from = location.state?.from || '/';

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    },
    businessDetails: {
      companyName: '',
      gstNumber: '',
      businessType: '',
    },
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setRegisterData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setRegisterData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(loginData.email, loginData.password);
    console.log(result);
    
    if (result.success) {
        // saveAuth()
      navigate('/', { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const result = await register(registerData);

    if (result.success) {
      toast.success('Registration successful!');
      navigate('/login');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-5xl">
        {/* Page heading with outer padding/space */}
        {/* <div className="mb-6 sm:mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-sky-500 text-white text-lg font-bold">
            S
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
            SRS Stall Booking
          </h1>
          <p className="mt-1 text-[12px] sm:text-sm text-slate-500">
            Login or create an account to manage your stall bookings.
          </p>
        </div> */}

        {/* Card container with spacing around */}
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1.4fr] gap-0 rounded-3xl border border-slate-200 bg-white shadow-[0_18px_80px_rgba(15,23,42,0.08)] overflow-hidden">
          {/* Left brand panel (light) */}
          <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-orange-500 via-orange-400 to-sky-500 px-6 py-6 text-white">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-9 w-9 rounded-2xl bg-white/10 flex items-center justify-center text-lg font-bold">
                  S
                </div>
                <div>
                  <p className="text-sm font-semibold">SRS Stall Booking</p>
                  <p className="text-[11px] text-white/80">
                    Event stall reservations, simplified.
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Manage stalls with a clean, app-style dashboard.
              </h2>
              <p className="text-[13px] text-white/85 leading-relaxed">
                Secure stalls, track bookings, and keep your business profile
                ready for every event.
              </p>
            </div>

            <div className="mt-6 space-y-2 text-[11px] text-white/80">
              <p>• Real-time stall locking and payments</p>
              <p>• Mobile-first seat and stall layouts</p>
              <p>• Profile, GST, and company info in one place</p>
            </div>
          </div>

          {/* Right auth panel */}
          <div className="bg-white px-4 sm:px-6 py-5 sm:py-6">
            {/* Mobile logo inline */}
            <div className="md:hidden mb-4 flex items-center justify-center gap-2">
              <div className="h-8 w-8 rounded-2xl bg-gradient-to-r from-orange-500 to-sky-500 flex items-center justify-center text-sm font-bold text-white">
                S
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">
                  SRS Stall Booking
                </p>
                <p className="text-[11px] text-slate-500">
                  Login or create an account to continue.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 p-1 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  activeTab === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ArrowLeftOnRectangleIcon className="h-3.5 w-3.5" />
                <span>Login</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  activeTab === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlusIcon className="h-3.5 w-3.5" />
                <span>Register</span>
              </button>
            </div>

            {/* Content with inner scroll only if needed */}
            <div className="max-h-[70vh] overflow-y-auto pr-1">
              {activeTab === 'login' ? (
                <form
                  onSubmit={handleLoginSubmit}
                  className="space-y-4"
                >
                  <div>
                    <p className="text-[11px] font-medium text-slate-700 mb-1.5">
                      Email address
                    </p>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      required
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[11px] font-medium text-slate-700">
                        Password
                      </p>
                      <button
                        type="button"
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-800"
                        onClick={() => setShowLoginPassword((p) => !p)}
                      >
                        {showLoginPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        name="password"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((p) => !p)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showLoginPassword ? (
                          <EyeSlashIcon className="h-4 w-4 text-slate-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || loading}
                    className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(56,189,248,0.4)] disabled:opacity-60 disabled:cursor-not-allowed hover:from-orange-400 hover:via-orange-500 hover:to-sky-400"
                  >
                    {isLoading || loading ? 'Signing in…' : 'Sign in'}
                  </button>

                  <p className="mt-2 text-[11px] text-slate-500">
                    New to SRS?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="font-medium text-orange-600 hover:text-orange-700"
                    >
                      Create an account
                    </button>
                  </p>
                </form>
              ) : (
                <form
                  onSubmit={handleRegisterSubmit}
                  className="space-y-4 text-[13px]"
                >
                  {/* Personal */}
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700 mb-2">
                      Personal information
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">
                          Full name *
                        </label>
                        <input
                          name="name"
                          type="text"
                          required
                          value={registerData.name}
                          onChange={handleRegisterChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">
                          Phone *
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          required
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                          placeholder="10-digit phone"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account */}
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700 mb-2">
                      Account
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">
                          Email *
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">
                            Password *
                          </label>
                          <div className="relative">
                            <input
                              name="password"
                              type={showRegPassword ? 'text' : 'password'}
                              required
                              value={registerData.password}
                              onChange={handleRegisterChange}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                              placeholder="Min 6 characters"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegPassword((p) => !p)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                              {showRegPassword ? (
                                <EyeSlashIcon className="h-4 w-4 text-slate-400" />
                              ) : (
                                <EyeIcon className="h-4 w-4 text-slate-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">
                            Confirm password *
                          </label>
                          <div className="relative">
                            <input
                              name="confirmPassword"
                              type={showRegConfirmPassword ? 'text' : 'password'}
                              required
                              value={registerData.confirmPassword}
                              onChange={handleRegisterChange}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                              placeholder="Repeat password"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowRegConfirmPassword((p) => !p)
                              }
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                              {showRegConfirmPassword ? (
                                <EyeSlashIcon className="h-4 w-4 text-slate-400" />
                              ) : (
                                <EyeIcon className="h-4 w-4 text-slate-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700 mb-2">
                      Address (optional)
                    </p>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">
                          Street
                        </label>
                        <input
                          name="address.street"
                          type="text"
                          value={registerData.address.street}
                          onChange={handleRegisterChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                          placeholder="Street address"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">
                            City
                          </label>
                          <input
                            name="address.city"
                            type="text"
                            value={registerData.address.city}
                            onChange={handleRegisterChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">
                            State
                          </label>
                          <input
                            name="address.state"
                            type="text"
                            value={registerData.address.state}
                            onChange={handleRegisterChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">
                            ZIP
                          </label>
                          <input
                            name="address.zipCode"
                            type="text"
                            value={registerData.address.zipCode}
                            onChange={handleRegisterChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business */}
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700 mb-2">
                      Business (optional)
                    </p>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">
                          Company name
                        </label>
                        <input
                          name="businessDetails.companyName"
                          type="text"
                          value={registerData.businessDetails.companyName}
                          onChange={handleRegisterChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">
                            GST number
                          </label>
                          <input
                            name="businessDetails.gstNumber"
                            type="text"
                            value={registerData.businessDetails.gstNumber}
                            onChange={handleRegisterChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 mb-1">
                            Business type
                          </label>
                          <select
                            name="businessDetails.businessType"
                            value={registerData.businessDetails.businessType}
                            onChange={handleRegisterChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                          >
                            <option value="">Select</option>
                            <option value="retail">Retail</option>
                            <option value="wholesale">Wholesale</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="services">Services</option>
                            <option value="food">Food & Beverage</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || loading}
                    className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(56,189,248,0.4)] disabled:opacity-60 disabled:cursor-not-allowed hover:from-orange-400 hover:via-orange-500 hover:to-sky-400"
                  >
                    {isLoading || loading? 'Creating account…' : 'Create account'}
                  </button>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="font-medium text-orange-600 hover:text-orange-700"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>

            <p className="mt-4 text-[10px] text-slate-400 text-center">
              By continuing, you agree to the SRS terms of use and privacy
              policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
