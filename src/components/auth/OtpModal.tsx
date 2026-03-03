"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  onOtpVerified: (data: { registered: boolean; token?: string; tempToken?: string; user?: any }) => void;
}

export default function OtpModal({ isOpen, onClose, phone, onOtpVerified }: OtpModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(180); // 3 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setResendTimer(180);
      // Focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendTimer > 0 && isOpen) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer, isOpen]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, '');
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await authApi.verifyOtp(phone, otpString);
      if (response.data) {
        onOtpVerified(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    setError('');
    try {
      await authApi.requestOtp(phone);
      setResendTimer(180);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const maskedPhone = phone ? `******${phone.slice(-4)}` : '';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex"
        >
          {/* Left Section - Promotional */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-orange-100 to-orange-50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-orange-300 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 p-8 flex flex-col items-center justify-center text-center">
              <div className="mb-6">
                <div className="text-2xl font-bold text-gray-800 mb-2">Personalized</div>
                <div className="text-4xl font-bold text-[#702540] mb-4">Curations</div>
                <div className="w-32 h-1 bg-[#702540] mx-auto mb-4"></div>
              </div>
              <p className="text-gray-700 text-lg">Explore curations based on your interests</p>
            </div>
          </div>

          {/* Right Section - OTP Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify with OTP</h2>
              <p className="text-gray-600 mb-8">Sent to {maskedPhone}</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Enter OTP
                  </label>
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#702540] focus:border-[#702540] transition-all bg-white text-gray-900"
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
                  )}
                </div>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-600">
                      Resend OTP in <span className="font-semibold">{formatTime(resendTimer)}</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={isLoading}
                      className="text-sm text-[#702540] hover:underline font-medium disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  onClick={handleVerify}
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full bg-[#702540] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#8a3052] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By continuing, I agree to{' '}
                  <a href="#" className="text-[#702540] underline">Terms of Use</a>
                  {' '}&{' '}
                  <a href="#" className="text-[#702540] underline">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

