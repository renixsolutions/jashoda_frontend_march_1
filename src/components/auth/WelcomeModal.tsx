"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { authApi } from '@/lib/api';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOtpSent: (phone: string) => void;
}

export default function WelcomeModal({ isOpen, onClose, onOtpSent }: WelcomeModalProps) {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phone || phone.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const fullPhone = countryCode + phone.replace(/\D/g, '');
      await authApi.requestOtp(fullPhone);
      onOtpSent(fullPhone);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
                <div className="w-24 h-24 bg-[#702540] rounded-full flex items-center justify-center mb-4 mx-auto">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#702540] rounded-full"></div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 mb-4">
                  <p className="text-sm text-gray-600 mb-1">On your first order get</p>
                  <p className="text-3xl font-bold text-[#702540]">₹500 off</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-lg font-semibold text-gray-800 mb-4">And other benefits</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-[#702540]">N</span>
                    </div>
                    <span className="text-sm">Encircle & Tata Neu coins</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-pink-500">♥</span>
                    </div>
                    <span className="text-sm">Unlock wishlist</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-sm">🎯</span>
                    </div>
                    <span className="text-sm">Personalized shopping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Jashoda!</h2>
              <p className="text-gray-600 mb-8">Login/Signup to get exclusive Jashoda privileges</p>

              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#702540] focus:border-[#702540] bg-white text-gray-900 cursor-pointer transition-colors hover:border-[#702540]"
                    >
                      <option value="+91">🇮🇳 +91</option>
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) setPhone(value);
                      }}
                      placeholder="Enter mobile number"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#702540] focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                      maxLength={10}
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !phone || phone.length < 10}
                  className="w-full bg-[#702540] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#8a3052] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Request OTP'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By continuing, I agree to{' '}
                  <a href="#" className="text-[#702540] underline">Terms of Use</a>
                  {' '}&{' '}
                  <a href="#" className="text-[#702540] underline">Privacy Policy</a>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

