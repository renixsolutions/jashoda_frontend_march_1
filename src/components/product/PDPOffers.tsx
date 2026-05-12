"use client";

import React, { useState, useEffect } from 'react';
import { Ticket, Copy, CheckCircle2, ChevronRight } from 'lucide-react';
import { offersApi } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export const PDPOffers: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { appliedCoupon, applyCoupon } = useCart();


  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await offersApi.getAvailableOffers();
        if (res.success) {
          // Only show top 3 relevant offers for PDP
          setOffers(res.data?.slice(0, 3) || []);
        }
      } catch (err) {
        console.error('Failed to fetch PDP offers:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const copyCode = (offer: any) => {
    navigator.clipboard.writeText(offer.code);
    applyCoupon(offer);
    toast.success(`Offer applied! Coupon ${offer.code} copied to clipboard.`, {

      style: {
        background: '#1E2856',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      },
      iconTheme: {
        primary: '#D4AF37',
        secondary: '#1E2856'
      }
    });
  };

  if (isLoading || offers.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1E2856] flex items-center gap-2">
          <Ticket className="w-4 h-4 text-[#D4AF37]" />
          Available Offers
        </h3>
        <a href="/offers" className="text-[10px] font-bold uppercase tracking-tighter text-gray-400 hover:text-[#D4AF37] flex items-center transition-colors">
          View All <ChevronRight className="w-3 h-3" />
        </a>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide no-scrollbar">
        {offers.map((offer) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => copyCode(offer)}
            className={cn(
              "flex-shrink-0 w-[240px] bg-white border border-dashed rounded-xl p-4 relative overflow-hidden group transition-all cursor-pointer hover:shadow-lg active:scale-95",
              appliedCoupon?.code === offer.code 
                ? "border-[#D4AF37] bg-[#D4AF37]/5 shadow-md ring-1 ring-[#D4AF37]/30" 
                : "border-[#D4AF37]/30 hover:border-[#D4AF37]"
            )}
          >
            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/5 blur-2xl rounded-full -z-10 group-hover:bg-[#D4AF37]/20 transition-all" />
            
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
                  {offer.discount_type === 'PERCENTAGE' ? `${offer.discount_value}% Off` : `₹${offer.discount_value} Off`}
                </p>
                <h4 className="text-sm font-bold text-[#1E2856] line-clamp-1 group-hover:text-[#D4AF37] transition-colors">{offer.title}</h4>
              </div>
              <div className="p-1.5 rounded-lg bg-gray-50 text-gray-400 group-hover:text-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all">
                <Copy className="w-3 h-3" />
              </div>
            </div>

            <p className="text-[11px] text-gray-500 line-clamp-1 mb-3">
              Min. Purchase: ₹{offer.min_purchase || 0}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div className="px-2 py-1 bg-gray-50 rounded border border-gray-100 group-hover:border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/5 transition-all">
                <code className="text-[10px] font-bold text-[#1E2856] font-mono tracking-wider">{offer.code}</code>
              </div>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1",
                appliedCoupon?.code === offer.code ? "text-emerald-600" : "text-gray-400 group-hover:text-[#1E2856]"
              )}>
                {appliedCoupon?.code === offer.code ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" /> Applied
                  </>
                ) : (
                  <>
                    Click to Apply <ChevronRight className="w-2 h-2" />
                  </>
                )}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
