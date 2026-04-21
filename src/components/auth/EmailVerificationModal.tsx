"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

export default function EmailVerificationModal({ isOpen, onClose, email }: EmailVerificationModalProps) {
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleResend = async () => {
        setIsSending(true);
        try {
            await authApi.resendVerification();
            setIsSent(true);
            toast.success("Verification email sent!");
        } catch (error: any) {
            toast.error(error.message || "Failed to send verification email");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 text-center">
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="w-16 h-16 bg-[#1E2856]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-8 h-8 text-[#1E2856]" />
                            </div>

                            <h2 className="text-2xl font-serif text-[#1E2856] mb-3">Email Verification Required</h2>
                            <p className="text-gray-500 mb-8">
                                To ensure secure transactions, we require you to verify your email address <strong>{email}</strong> before placing an order.
                            </p>

                            {isSent ? (
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-8 flex items-start gap-3 text-left">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Verification Link Sent</p>
                                        <p className="text-xs text-green-700">Please check your inbox and click the link to verify your account. You can then refresh this page to proceed.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 flex items-start gap-3 text-left">
                                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-800">Check your inbox</p>
                                        <p className="text-xs text-amber-700">If you didn't receive the email, we can send you another one.</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Button
                                    onClick={handleResend}
                                    disabled={isSending || isSent}
                                    className="w-full py-4 bg-[#1E2856] text-white rounded-xl hover:bg-[#151b3b] font-medium flex items-center justify-center gap-2"
                                >
                                    {isSending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        isSent ? 'Email Sent' : 'Resend Verification Email'
                                    )}
                                </Button>
                                
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="w-full py-3 text-gray-500 hover:text-gray-700"
                                >
                                    Dismiss
                                </Button>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400 font-light">
                                Already verified? <button onClick={() => window.location.reload()} className="text-[#1E2856] font-semibold hover:underline">Refresh Page</button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
