"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Calendar, CheckCircle, Clock, Lock, ArrowRight, Star } from 'lucide-react';
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
  
  const getStatusIcon = () => {
    switch (offer.status) {
      case 'ACTIVE': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'USED': return <Lock className="w-4 h-4 text-amber-500" />;
      case 'EXPIRED': return <Clock className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = () => {
    switch (offer.status) {
      case 'ACTIVE': return 'Available';
      case 'USED': return 'Already Used';
      case 'EXPIRED': return 'Expired';
      case 'DISABLED': return 'Disabled';
      default: return offer.status;
    }
  };

  return (
    <motion.div
      whileHover={!isInactive ? { y: -5, scale: 1.02 } : {}}
      className={cn(
        "relative overflow-hidden rounded-2xl group transition-all duration-500",
        "bg-black border border-white/10",
        !isInactive ? "shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)]" : "opacity-60 grayscale"
      )}
    >
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black opacity-100" />
      
      {/* Decorative Shimmer Border (Gold) */}
      {!isInactive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative p-6 z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            {getStatusIcon()}
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
              {getStatusLabel()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#D4AF37]">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Premium Offer</span>
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
            {offer.title}
          </h3>
          <p className="text-sm text-white/50 line-clamp-2 min-h-[40px]">
            {offer.description || `Special discount on your favourite jewellery pieces.`}
          </p>
        </div>

        {/* Discount Value */}
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {offer.discount_type === 'PERCENTAGE' ? `${offer.discount_value}%` : `₹${offer.discount_value}`}
          </span>
          <span className="text-xs text-white/40 font-medium uppercase tracking-wider">OFF</span>
        </div>

        {/* Dynamic Chips Section */}
        <div className="flex flex-wrap gap-2 mb-6 min-h-[60px]">
          {offer.categories?.map((cat, i) => (
            <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] text-white/60 font-medium uppercase">
              {cat.name}
            </span>
          ))}
          {offer.genders?.map((gen, i) => (
            <span key={i} className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[9px] text-indigo-300 font-medium uppercase">
              {gen.name}
            </span>
          ))}
          {offer.collections?.map((coll, i) => (
            <span key={i} className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-300 font-medium uppercase">
              {coll.name}
            </span>
          ))}
          {!offer.categories?.length && !offer.collections?.length && (
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] text-white/40 font-medium uppercase">
              Site Wide
            </span>
          )}
        </div>

        {/* Coupon Code Section */}
        <div className="relative group/code mb-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 border-dashed group-hover/code:border-[#D4AF37]/50 transition-all">
            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5 text-[#D4AF37]" />
              <code className="text-lg font-bold text-white tracking-widest">
                {offer.code}
              </code>
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(offer.code);
                // toast.success('Code copied!');
              }}
              className="text-[10px] font-bold text-[#D4AF37] uppercase hover:underline"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-white/40">
            <Calendar className="w-3 h-3" />
            <span className="text-[10px] font-medium">Expires: {new Date(offer.expiry_date).toLocaleDateString()}</span>
          </div>
          
          <button
            disabled={isInactive}
            onClick={() => onApply?.(offer.code)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
              !isInactive 
                ? "bg-[#D4AF37] text-black hover:bg-white hover:scale-105 active:scale-95" 
                : "bg-white/5 text-white/20 cursor-not-allowed"
            )}
          >
            {isInactive ? 'Unavailable' : 'Apply Offer'}
            {!isInactive && <ArrowRight className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Decorative Soft Glow */}
      {!isInactive && (
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#D4AF37]/10 blur-[80px] rounded-full pointer-events-none" />
      )}
    </motion.div>
  );
};
