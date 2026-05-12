"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Ticket, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatsProps {
  stats: {
    total_offers: number;
    active_offers: number;
    expired_offers: number;
    total_usage: number;
    total_savings: number;
    avg_usage_rate: string;
  };
}

export const OfferAnalyticsCards: React.FC<StatsProps> = ({ stats }) => {
  const cards = [
    { label: 'Total Offers', value: stats.total_offers, icon: Ticket, color: 'text-white' },
    { label: 'Active', value: stats.active_offers, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Expired', value: stats.expired_offers, icon: AlertCircle, color: 'text-red-400' },
    { label: 'Total Usage', value: stats.total_usage, icon: Users, color: 'text-[#D4AF37]' },
    { label: 'Customer Savings', value: `₹${stats.total_savings.toLocaleString()}`, icon: TrendingUp, color: 'text-[#D4AF37]' },
    { label: 'Usage Rate', value: `${stats.avg_usage_rate}%`, icon: Clock, color: 'text-blue-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="bg-black border border-white/10 p-5 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all"
        >
          <div className="relative z-10 space-y-2">
            <card.icon className={`w-5 h-5 ${card.color}`} />
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{card.label}</p>
            <h4 className="text-xl font-bold text-white tracking-tight">{card.value}</h4>
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/5 blur-2xl rounded-full group-hover:bg-[#D4AF37]/5 transition-all" />
        </motion.div>
      ))}
    </div>
  );
};
