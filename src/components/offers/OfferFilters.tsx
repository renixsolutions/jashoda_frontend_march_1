"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';

interface OfferFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const OfferFilters: React.FC<OfferFiltersProps> = ({ onFilterChange }) => {
  const { categories, genders, occasions } = useNavigation();
  const [activeFilters, setActiveFilters] = useState<any>({
    category: null,
    gender: null,
    status: 'ACTIVE',
    search: ''
  });

  const handleFilterClick = (type: string, value: any) => {
    const newFilters = { ...activeFilters, [type]: activeFilters[type] === value ? null : value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-8 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Special Offers</h2>
          <p className="text-white/40 text-sm">Discover exclusive deals and limited-time discounts.</p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <input
            type="text"
            placeholder="Search coupon code..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all placeholder:text-white/20"
            value={activeFilters.search}
            onChange={(e) => handleFilterClick('search', e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#D4AF37] transition-colors" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest">
          <Filter className="w-3 h-3" />
          Filter By:
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilterClick('category', cat.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border",
                activeFilters.category === cat.id
                  ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/10 hidden lg:block" />

        {/* Genders Chips */}
        <div className="flex flex-wrap gap-2">
          {genders.map((gen) => (
            <button
              key={gen.id}
              onClick={() => handleFilterClick('gender', gen.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border",
                activeFilters.gender === gen.id
                  ? "bg-indigo-500 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              )}
            >
              {gen.name}
            </button>
          ))}
        </div>

        {(activeFilters.category || activeFilters.gender || activeFilters.search) && (
          <button
            onClick={() => {
              const reset = { category: null, gender: null, status: 'ACTIVE', search: '' };
              setActiveFilters(reset);
              onFilterChange(reset);
            }}
            className="flex items-center gap-2 text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

// Helper for class names
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
