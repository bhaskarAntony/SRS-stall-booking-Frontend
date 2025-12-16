import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP, isLoading } = useAuthStore();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    // Timer for OTP expiry
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    const result = await verifyOTP(email, otpString);
    
    if (result.success) {
      toast.success('Email verified successfully!');
      navigate('/');
    } else {
      toast.error(result.message);
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    const result = await resendOTP(email);
    
    if (result.success) {
      toast.success('OTP sent successfully!');
      setTimeLeft(600);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } else {
      toast.error(result.message);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/register')}
              className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
            <p className="text-gray-600 mt-2">
              We've sent a 6-digit code to
            </p>
            <p className="text-blue-600 font-medium">{email}</p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-sm">
                    Code expires in {formatTime(timeLeft)}
                  </span>
                </div>
              ) : (
                <p className="text-red-600 text-sm">OTP has expired</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOTP}
              disabled={!canResend || isLoading}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {canResend ? 'Resend Code' : `Resend in ${formatTime(timeLeft)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;