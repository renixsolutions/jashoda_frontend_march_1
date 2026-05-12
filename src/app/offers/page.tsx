import React from 'react';
import { OfferGrid } from '@/components/offers/OfferGrid';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Exclusive Offers | Jashoda Jewels',
  description: 'Explore exclusive discounts and offers on our premium jewellery collections.',
};

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-[#050505] pt-32">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('/assets/images/hero-bg-dark.jpg')] bg-cover bg-center opacity-30 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505]" />
        
        <div className="relative z-10 text-center space-y-4 px-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Members Exclusive</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Timeless Luxury, <br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F9E4B7] to-[#D4AF37] bg-clip-text text-transparent">Exclusive Rewards</span>
          </h1>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#D4AF37]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#D4AF37]/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <OfferGrid />
      
      <Footer />
    </main>
  );
}
