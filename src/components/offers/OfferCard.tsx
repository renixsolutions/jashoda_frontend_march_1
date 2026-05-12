"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OfferCardProps {
  offer: {
    id: number;
    title: string;
    description?: string;
    code: string;
    discount_type: 'PERCENTAGE' | 'FIXED';
    discount_value: number;
    min_purchase?: number;
    max_discount?: number;
    expiry_date: string;
    status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'DISABLED';
    categories?: { name: string }[];
    genders?: { name: string }[];
    collections?: { name: string }[];
    tags?: { name: string }[];
  };
  onApply?: (code: string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onApply }) => {
  const isInactive = offer.status !== 'ACTIVE';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format date elegantly e.g. "DECEMBER 20, 2025."
  const formattedExpiry = new Date(offer.expiry_date)
    .toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase() + ".";

  const targetCategoryText = offer.categories?.[0]?.name || 'ALL JEWELLERY';
  const cleanDiscountVal = parseFloat(offer.discount_value as any || 0);

  return (
    <motion.div
      whileHover={!isInactive ? { y: -6, scale: 1.015 } : {}}
      className={cn(
        "relative bg-[#31111B] rounded-[28px] p-7 flex flex-col justify-between overflow-hidden transition-all duration-400 min-h-[420px] select-none mx-auto w-full max-w-sm border border-[#C5A059]/25 box-border",
        !isInactive ? "shadow-xl hover:shadow-2xl hover:border-[#C5A059]/60" : "opacity-60 grayscale"
      )}
    >
      {/* Top Edge Perforation Semi-Circle Notch precisely aligned */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-5 bg-[#050505] rounded-b-full z-20 shadow-inner"></div>
      
      {/* Bottom Edge Perforation Semi-Circle Notch precisely aligned */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-5 bg-[#050505] rounded-t-full z-20 shadow-inner"></div>

      {/* Subtle Inner Frame Fine Border */}
      <div className="absolute inset-2 border border-[#C5A059]/15 rounded-[20px] pointer-events-none"></div>

      {/* Card Header Content */}
      <div className="mt-4 flex flex-col items-center z-10 w-full">
        {/* Dynamic Title Hero */}
        <span className="text-base md:text-lg tracking-widest text-[#EBE7E0] font-bold block text-center font-serif uppercase">
          {offer.title || 'Sparkling'}
        </span>

        {/* Huge Hero Discount Figures in Antique Gold */}
        <div className="my-1 text-center w-full">
          <span className="text-7xl md:text-8xl font-serif font-light text-[#D4AF37] tracking-tight block scale-y-105">
            {offer.discount_type === 'PERCENTAGE' ? `${cleanDiscountVal}%` : `₹${cleanDiscountVal}`}
          </span>
        </div>

        {/* Flanked Editorial Line Precisely Structured */}
        <div className="flex items-center gap-2 my-3 w-full px-1">
          <div className="h-[1px] bg-[#C5A059]/25 flex-1" />
          <span className="text-[9px] font-serif tracking-[0.25em] text-[#C5A059] uppercase text-center shrink-0">
            {targetCategoryText} — OFF
          </span>
          <div className="h-[1px] bg-[#C5A059]/25 flex-1" />
        </div>

        {/* Extra rules prompt if configured */}
        {offer.min_purchase ? (
          <span className="text-[8px] font-sans font-medium tracking-widest text-[#EBE7E0]/60 uppercase block text-center mt-1">
            Min. Spend: ₹{parseFloat(offer.min_purchase as any)}
          </span>
        ) : null}
      </div>

      {/* Middle Block: Copy Code Box */}
      <div className="my-auto py-4 flex flex-col items-center z-10 w-full px-4">
        <span className="text-[8px] uppercase tracking-widest text-[#C5A059]/70 font-sans font-bold mb-1.5 block text-center">
          Promocode
        </span>
        <div className="flex items-center justify-between w-full max-w-[200px] bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl px-3 py-2 transition-all hover:bg-[#C5A059]/15 box-border">
          <code className="text-xs font-mono font-bold tracking-widest text-[#D4AF37]">
            {offer.code}
          </code>
          <button 
            onClick={handleCopy}
            className={cn(
              "text-[8px] font-bold tracking-wider uppercase transition-colors shrink-0 pl-2 font-sans",
              copied ? "text-[#D4AF37]" : "text-[#EBE7E0]/80 hover:text-[#D4AF37] hover:underline"
            )}
          >
            {copied ? 'COPIED!' : 'COPY'}
          </button>
        </div>
      </div>

      {/* Bottom Block: Launch Info & Expiry Details */}
      <div className="text-center mb-4 z-10 space-y-1 w-full">
        <span className="block text-[9px] uppercase font-sans font-bold tracking-[0.25em] text-[#EBE7E0]/60">
          {offer.status === 'ACTIVE' ? 'LAUNCH DAY OFFER' : offer.status}
        </span>
        <span className="block text-xs font-serif tracking-widest text-[#EBE7E0]">
          {formattedExpiry}
        </span>

        {/* Integrated Direct Action Trigger */}
        <div className="pt-3 w-full">
          <button
            disabled={isInactive}
            onClick={() => onApply?.(offer.code)}
            className={cn(
              "w-full py-2.5 rounded-xl text-[9px] font-sans font-bold uppercase tracking-[0.2em] transition-all shadow-xs box-border block text-center",
              !isInactive 
                ? "bg-[#C5A059] text-[#31111B] hover:bg-[#d8b56f] active:scale-95 cursor-pointer font-extrabold" 
                : "bg-white/10 text-white/40 cursor-not-allowed"
            )}
          >
            {isInactive ? 'Offer Ended' : 'Apply Offer'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
