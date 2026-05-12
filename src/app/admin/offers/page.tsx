"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Download, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { AdminOfferTable } from '@/components/admin/offers/AdminOfferTable';
import { AdminOfferForm } from '@/components/admin/offers/AdminOfferForm';
import { OfferAnalyticsCards } from '@/components/admin/offers/OfferAnalyticsCards';
import { offersApi } from '@/lib/api';
import Link from 'next/link';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [offersRes, statsRes] = await Promise.all([
        offersApi.adminGetOffers(),
        offersApi.getOfferStats()
      ]);
      
      if (offersRes.success) setOffers(offersRes.data || []);
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateNew = () => {
    setEditingOffer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this exclusive offer?')) {
      const res = await offersApi.adminDeleteOffer(id);
      if (res.success) fetchData();
    }
  };

  const filteredOffers = offers.filter(o => 
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 text-white/40 hover:text-[#D4AF37] transition-colors text-xs font-bold uppercase tracking-widest mb-4"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F9E4B7] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Luxury Offer Management</h1>
            </div>
            <p className="text-white/40 text-sm max-w-xl">
              Curate and manage exclusive rewards for your premium clientele. Track usage analytics and optimize conversion.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
              <Download className="w-4 h-4" />
              Export Stats
            </button>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_10px_20px_rgba(212,175,55,0.15)]"
            >
              <Plus className="w-4 h-4" />
              New Offer
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        {stats && <OfferAnalyticsCards stats={stats} />}

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="relative group w-full md:w-96">
            <input
              type="text"
              placeholder="Search by title or coupon code..."
              className="w-full bg-black border border-white/10 rounded-xl py-3 px-12 text-sm text-white focus:border-[#D4AF37] outline-none transition-all placeholder:text-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#D4AF37] transition-colors" />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 rounded-xl border border-white/10 text-white/40 hover:text-white transition-all">
              <Filter className="w-5 h-5" />
            </button>
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-4 py-2 rounded-lg border border-white/5">
              Showing {filteredOffers.length} of {offers.length} Offers
            </div>
          </div>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
            <p className="text-white/20 font-bold uppercase tracking-widest text-[10px]">Loading Luxury Assets...</p>
          </div>
        ) : (
          <AdminOfferTable 
            offers={filteredOffers} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}

        {/* Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFormOpen(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              />
              <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <AdminOfferForm 
                  initialData={editingOffer} 
                  onSuccess={() => {
                    setIsFormOpen(false);
                    fetchData();
                  }}
                  onCancel={() => setIsFormOpen(false)}
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
