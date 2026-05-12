"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, ExternalLink, Calendar, Users, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfferTableProps {
  offers: any[];
  onEdit: (offer: any) => void;
  onDelete: (id: number) => void;
}

export const AdminOfferTable: React.FC<OfferTableProps> = ({ offers, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-black shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Offer Details</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Code</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Discount</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Validity</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Usage</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Status</th>
            <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <AnimatePresence>
            {offers.map((offer, index) => (
              <motion.tr
                key={offer.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.03 }}
                className="group hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">{offer.title}</p>
                    <p className="text-[10px] text-white/30 truncate max-w-[200px]">{offer.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs font-mono font-bold text-[#D4AF37]">
                    {offer.code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-white">
                    {offer.discount_type === 'PERCENTAGE' ? `${offer.discount_value}%` : `₹${offer.discount_value}`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[10px] text-white/50">
                    <Calendar className="w-3 h-3" />
                    {new Date(offer.expiry_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                    <Users className="w-3 h-3 text-[#D4AF37]" />
                    {offer.usage_count || 0}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-center",
                      offer.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    )}>
                      {offer.is_active ? 'Active' : 'Disabled'}
                    </span>
                    {offer.is_one_time && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest text-center border border-[#D4AF37]/20">
                        One-time
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => onEdit(offer)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(offer.id)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
      {offers.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-white/20 text-sm italic">No offers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
