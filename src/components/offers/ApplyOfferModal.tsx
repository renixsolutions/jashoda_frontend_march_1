"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ticket, Check, AlertCircle, Loader2 } from 'lucide-react';
import { offersApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { useCart } from '@/contexts/CartContext';

interface ApplyOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  onApply?: (discount: any) => void;
}

export const ApplyOfferModal: React.FC<ApplyOfferModalProps> = ({ isOpen, onClose, cartTotal, onApply }) => {
  const { applyCoupon } = useCart();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [message, setMessage] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;

    try {
      setIsVerifying(true);
      setStatus('IDLE');
      
      const res = await offersApi.validateCoupon(code.toUpperCase(), cartTotal);
      
      if (res.success) {
        setStatus('SUCCESS');
        setMessage(res.message || 'Coupon applied successfully!');
        
        // Trigger Success Confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#000000', '#FFFFFF']
        });

        setTimeout(() => {
          applyCoupon(res.data);
          if (onApply) onApply(res.data);
          onClose();
        }, 1500);
      } else {
        setStatus('ERROR');
        setMessage(res.message || 'Invalid or expired coupon code.');
      }
    } catch (err: any) {
      setStatus('ERROR');
      setMessage(err.message || 'Failed to validate coupon.');
    } finally {
      setIsVerifying(false);
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#D4AF37]/10 blur-[80px] rounded-full -z-10" />

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <Ticket className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Apply Promo Code</h2>
              </div>
              <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter coupon code..."
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className={cn(
                    "w-full bg-white/5 border rounded-2xl py-4 px-6 text-sm text-white font-mono tracking-widest focus:outline-none transition-all",
                    status === 'SUCCESS' ? "border-emerald-500/50" : 
                    status === 'ERROR' ? "border-red-500/50" : 
                    "border-white/10 focus:border-[#D4AF37]"
                  )}
                />
                {isVerifying && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {status !== 'IDLE' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      "p-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider",
                      status === 'SUCCESS' ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    )}
                  >
                    {status === 'SUCCESS' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                disabled={!code.trim() || isVerifying}
                onClick={handleApply}
                className="w-full bg-[#D4AF37] text-black h-14 rounded-2xl font-bold uppercase tracking-widest hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
              >
                {status === 'SUCCESS' ? 'Applied!' : 'Redeem Offer'}
              </button>

              <div className="pt-4 text-center">
                <button 
                  onClick={() => {
                    // Navigate to offers page
                    window.location.href = '/offers';
                  }}
                  className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors"
                >
                  View Available Offers
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
