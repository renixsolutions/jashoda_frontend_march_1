"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import CustomSelect from '@/components/ui/CustomSelect';

interface CompleteRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempToken: string;
  phone: string;
  onComplete: () => void;
}

export default function CompleteRegistrationModal({
  isOpen,
  onClose,
  tempToken,
  phone,
  onComplete,
}: CompleteRegistrationModalProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.completeRegistration(tempToken, {
        title: formData.title || undefined,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
      });

      if (response.data?.token && response.data?.user) {
        login(response.data.token, {
          ...response.data.user,
          email_verified: false,
        });
        onComplete();
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 13) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    return phoneNumber;
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
          {/* Left Section - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col bg-gradient-to-br from-orange-50 to-white">
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-[#702540] mb-2">Almost there!</h2>
              <p className="text-gray-600 mb-8">Welcome back, Please fill the missing fields.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <CustomSelect
                    options={[
                      { value: '', label: 'Select Title' },
                      { value: 'Mr', label: 'Mr' },
                      { value: 'Ms', label: 'Ms' },
                      { value: 'Mrs', label: 'Mrs' },
                      { value: 'Dr', label: 'Dr' },
                    ]}
                    value={formData.title}
                    onChange={(value) => setFormData({ ...formData, title: value })}
                    placeholder="Select Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#702540] focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      disabled
                      className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    >
                      <option value="+91">+91</option>
                    </select>
                    <input
                      type="tel"
                      value={formatPhone(phone)}
                      disabled
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Email ID
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#702540] focus:border-transparent bg-white text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#702540] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#8a3052] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Completing...' : 'Continue'}
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

          {/* Right Section - Promotional */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-orange-100 to-orange-50 relative overflow-hidden">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative z-10 p-8 flex flex-col items-center justify-center text-center h-full">
              <div className="mb-8 flex justify-center">
                <img
                  src="/jashoda-logo.png"
                  alt="Jashoda"
                  className="w-[500px] h-auto object-contain"
                />
              </div>
              <div className="w-48 h-0.5 bg-[#702540] mb-4"></div>
              <p className="text-xl font-semibold text-gray-800">DIAMONDS INSPIRED BY ROYALTY</p>
              <div className="w-48 h-0.5 bg-[#702540] mt-4"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

