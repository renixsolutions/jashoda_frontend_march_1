"use client";

import React, { useState, useEffect } from 'react';
import { Ticket, Copy, CheckCircle2, ChevronRight } from 'lucide-react';
import { offersApi } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export const PDPOffers: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await offersApi.getAvailableOffers();
        if (res.success) {
          setOffers(res.data?.slice(0, 4) || []);
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
    // If clicked coupon is already applied, un-apply it seamlessly
    if (appliedCoupon?.code === offer.code) {
      removeCoupon();
      toast.success(`Coupon ${offer.code} removed.`, {
        style: {
          background: '#31111B',
          color: '#EBE7E0',
          fontSize: '11px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          border: '1px solid rgba(197, 160, 89, 0.3)'
        },
        iconTheme: {
          primary: '#C5A059',
          secondary: '#31111B'
        }
      });
      return;
    }

    // Apply and copy code
    navigator.clipboard.writeText(offer.code);
    applyCoupon(offer);
    setCopiedId(offer.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success(`Offer applied! Coupon ${offer.code} copied.`, {
      style: {
        background: '#31111B',
        color: '#C5A059',
        fontSize: '11px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        border: '1px solid rgba(197, 160, 89, 0.3)'
      },
      iconTheme: {
        primary: '#C5A059',
        secondary: '#31111B'
      }
    });
  };

  if (isLoading || offers.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-100 pt-6 select-none w-full">
      {/* Premium Section Header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-xs font-serif font-bold uppercase tracking-widest text-[#31111B] flex items-center gap-2">
          <Ticket className="w-4 h-4 text-[#D4AF37]" />
          Available Offers
        </h3>
        <a href="/offers" className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400 hover:text-[#31111B] flex items-center transition-colors">
          View All <ChevronRight className="w-3 h-3 ml-0.5" />
        </a>
      </div>

      {/* Offers Slider Container */}
      <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide no-scrollbar pt-1 w-full">
        {offers.map((offer) => {
          const isApplied = appliedCoupon?.code === offer.code;
          const isCopied = copiedId === offer.id;
          const cleanDiscountVal = parseFloat(offer.discount_value || 0);

          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3, scale: 1.01 }}
              onClick={() => copyCode(offer)}
              className={cn(
                "flex-shrink-0 w-[285px] h-[165px] rounded-2xl p-4 relative overflow-hidden transition-all duration-300 cursor-pointer border box-border flex flex-col justify-between",
                isApplied 
                  ? "bg-gradient-to-br from-[#4A1525] to-[#31111B] border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]/30" 
                  : "bg-[#31111B] border-[#C5A059]/25 hover:shadow-xl hover:border-[#C5A059]/60 shadow-sm"
              )}
            >
              {/* Left Edge Punchout Notch precisely centered */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-7 bg-white rounded-r-full shadow-inner z-10 border-r border-y border-[#C5A059]/15" />
              
              {/* Right Edge Punchout Notch precisely centered */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-7 bg-white rounded-l-full shadow-inner z-10 border-l border-y border-[#C5A059]/15" />

              {/* Inner Decorative Accent Frame */}
              <div className="absolute inset-1.5 border border-[#C5A059]/15 rounded-[12px] pointer-events-none" />

              {/* Card Core Layout: Upper Content Block */}
              <div className="relative z-10 w-full px-1 pt-0.5">
                
                {/* Header Row: Primary Highlight Card Name */}
                <div className="flex justify-between items-center gap-2 w-full">
                  <span className="text-base font-serif font-bold tracking-widest text-[#EBE7E0] uppercase block truncate pr-1">
                    {offer.title || 'Special Offer'}
                  </span>
                  <span className="p-1 rounded-md bg-[#C5A059]/10 text-[#C5A059]/70 hover:text-[#C5A059] transition-colors shrink-0">
                    {isApplied || isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
                  </span>
                </div>

                {/* Secondary Highlight: Glistening Gold Discount Metrics */}
                <div className="mt-1">
                  <span className="text-xl font-serif font-semibold tracking-wide text-[#D4AF37] block">
                    {offer.discount_type === 'PERCENTAGE' ? `${cleanDiscountVal}% OFF` : `₹${cleanDiscountVal} OFF`}
                  </span>
                </div>

                {/* Editorial Track: Double Flanked Divider Rules */}
                <div className="flex items-center gap-2 my-2 w-full">
                  <div className="h-[1px] bg-[#C5A059]/20 flex-1" />
                  <span className="text-[8px] font-mono tracking-widest text-[#C5A059]/80 uppercase block">
                    VOUCHER
                  </span>
                  <div className="h-[1px] bg-[#C5A059]/20 flex-1" />
                </div>

                {/* Min Spend Helper Text */}
                {offer.min_purchase ? (
                  <span className="text-[9px] font-sans font-medium tracking-widest text-[#EBE7E0]/60 uppercase block text-center">
                    Min. Spend: ₹{parseFloat(offer.min_purchase)}
                  </span>
                ) : (
                  <span className="text-[9px] font-sans font-medium tracking-widest text-[#EBE7E0]/40 uppercase block text-center">
                    No Min. Spend
                  </span>
                )}
              </div>

              {/* Card Core Layout: Footer Promocode Strip */}
              <div className="relative z-10 w-full flex items-center justify-between gap-2 pt-2 mt-auto border-t border-[#C5A059]/15 px-1">
                {/* Clean, Sharp Solid Promocode Button/Pill */}
                <div className="px-2.5 py-0.5 bg-[#C5A059] rounded text-center shadow-xs">
                  <code className="text-[11px] font-extrabold text-[#31111B] tracking-widest font-mono uppercase block">
                    {offer.code}
                  </code>
                </div>

                {/* Dynamic Direct Interaction Action Label */}
                <span className={cn(
                  "text-[9px] font-sans font-bold uppercase tracking-widest transition-all",
                  isCopied ? "text-[#D4AF37] font-extrabold scale-105" : isApplied ? "text-[#D4AF37] font-bold" : "text-[#EBE7E0]/60 hover:text-[#EBE7E0]"
                )}>
                  {isCopied ? 'COPIED!' : isApplied ? 'APPLIED' : 'APPLY CODE'}
                </span>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
