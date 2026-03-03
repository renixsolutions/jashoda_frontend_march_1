"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import WelcomeModal from './WelcomeModal';
import OtpModal from './OtpModal';
import CompleteRegistrationModal from './CompleteRegistrationModal';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Notification from '@/components/ui/Notification';

type ModalState = 'welcome' | 'otp' | 'complete' | null;

function AuthModalManagerInner() {
  const { isAuthenticated, user, updateUser, login } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentModal, setCurrentModal] = useState<ModalState>(null);
  const [phone, setPhone] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  }>({ message: '', type: 'success', visible: false });
  const processedVerificationRef = useRef<string | null>(null);

  // Check for email verification from URL params
  useEffect(() => {
    const emailVerified = searchParams?.get('email_verified');
    const error = searchParams?.get('error');

    // Skip if no verification param or already processed this specific value
    if (!emailVerified || processedVerificationRef.current === emailVerified) {
      return;
    }

    // Only process if we have a user
    if (!user) {
      return;
    }

    if (emailVerified === '1') {
      // Only update if user is not already verified to prevent infinite loop
      if (!user.email_verified) {
        updateUser({ email_verified: true });
      }
      setNotification({
        message: 'Email verified successfully!',
        type: 'success',
        visible: true,
      });
      processedVerificationRef.current = emailVerified;
      // Clean URL
      router.replace(window.location.pathname);
    } else if (emailVerified === '0') {
      setNotification({
        message: error === 'invalid_or_expired'
          ? 'Email verification link is invalid or expired'
          : 'Email verification failed',
        type: 'error',
        visible: true,
      });
      processedVerificationRef.current = emailVerified;
      // Clean URL
      router.replace(window.location.pathname);
    }
  }, [searchParams, user, updateUser, router]);

  // Show welcome modal when user clicks login/signup (handled by Navbar)
  const handleOpenAuth = useCallback(() => {
    if (!isAuthenticated) {
      setCurrentModal('welcome');
    }
  }, [isAuthenticated]);

  // Expose function to parent components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).openAuthModal = handleOpenAuth;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).openAuthModal;
      }
    };
  }, [handleOpenAuth]);

  const handleOtpSent = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setCurrentModal('otp');
  };

  const handleOtpVerified = (data: {
    registered: boolean;
    token?: string;
    tempToken?: string;
    user?: any;
  }) => {
    if (data.registered && data.token && data.user) {
      // User is already registered, login them in
      login(data.token, {
        ...data.user,
        email_verified: data.user.email_verified || false,
      });
      setCurrentModal(null);
      setPhone('');
      setTempToken('');
    } else if (!data.registered && data.tempToken) {
      // New user, show complete registration
      setTempToken(data.tempToken);
      setCurrentModal('complete');
    }
  };

  const handleRegistrationComplete = () => {
    setCurrentModal(null);
    setPhone('');
    setTempToken('');
  };

  const handleClose = () => {
    setCurrentModal(null);
    setPhone('');
    setTempToken('');
  };

  // Don't show modals if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <WelcomeModal
        isOpen={currentModal === 'welcome'}
        onClose={handleClose}
        onOtpSent={handleOtpSent}
      />
      <OtpModal
        isOpen={currentModal === 'otp'}
        onClose={handleClose}
        phone={phone}
        onOtpVerified={handleOtpVerified}
      />
      <CompleteRegistrationModal
        isOpen={currentModal === 'complete'}
        onClose={handleClose}
        tempToken={tempToken}
        phone={phone}
        onComplete={handleRegistrationComplete}
      />
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </>
  );
}

export default function AuthModalManager() {
  return (
    <Suspense fallback={null}>
      <AuthModalManagerInner />
    </Suspense>
  );
}

