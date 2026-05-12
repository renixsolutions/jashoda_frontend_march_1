"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OfferCard } from './OfferCard';
import { OfferFilters } from './OfferFilters';
import { offersApi } from '@/lib/api';
import { Loader2, TicketSlash } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OfferGrid: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        // Assuming the API returns a 'data' array of offers
        const response = await offersApi.getAvailableOffers();
        if (response.success) {
          setOffers(response.data || []);
          setFilteredOffers(response.data || []);
        } else {
          setError(response.message || 'Failed to load offers');
        }
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError('Something went wrong. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleFilterChange = (filters: any) => {
    let result = [...offers];

    if (filters.category) {
      result = result.filter(o => o.categories?.some((c: any) => c.id === filters.category));
    }
    if (filters.gender) {
      result = result.filter(o => o.genders?.some((g: any) => g.id === filters.gender));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(o => 
        o.title.toLowerCase().includes(q) || 
        o.code.toLowerCase().includes(q)
      );
    }

    setFilteredOffers(result);
  };

  const handleApplyOffer = (code: string) => {
    // Trigger confetti for success
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FFFFFF', '#000000']
    });
    
    // In a real scenario, this would call cartApi to apply the coupon
    alert(`Coupon ${code} applied successfully!`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
        <p className="text-white/40 font-medium tracking-widest uppercase text-[10px]">Polishing the gold...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <OfferFilters onFilterChange={handleFilterChange} />
      
      <AnimatePresence mode="popLayout">
        {filteredOffers.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <OfferCard offer={offer} onApply={handleApplyOffer} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <TicketSlash className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Offers Found</h3>
            <p className="text-white/40 text-sm max-w-xs">
              We couldn't find any offers matching your current filters. Try resetting them!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
