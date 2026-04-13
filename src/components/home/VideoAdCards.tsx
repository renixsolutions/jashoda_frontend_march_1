"use client";

import React, { useEffect, useState } from "react";
import { MoveRight, Loader2 } from "lucide-react";
import { api, getMediaUrl } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function VideoAdCards() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await api.getHomeAds(true);
        if (res.success && res.data.length > 0) {
          setAds(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch home ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  const getAdLink = (ad: any) => {
    if (ad.link_url) return ad.link_url;
    
    const params = new URLSearchParams();
    if (ad.category_slug) params.append('category', ad.category_slug);
    if (ad.gender_slug) params.append('gender', ad.gender_slug);
    if (ad.occasion_slug) params.append('occasion', ad.occasion_slug);
    
    const qs = params.toString();
    return qs ? `/shop?${qs}` : '/shop';
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E2856]" />
      </div>
    );
  }

  // Fallback to hardcoded ones if none from API (for initial setup)
  const displayAds = ads.length > 0 ? ads : [
    {
      id: "f1",
      title: "Signature Collection",
      subtitle: "Brilliance in Motion",
      video_url: "/hero-video.mp4",
      link_text: "Explore Collection",
      link_url: "/shop"
    },
    {
      id: "f2",
      title: "Bridal Exclusives",
      subtitle: "Your Perfect Match",
      video_url: "/hero-video.mp4",
      link_text: "Shop Bridal",
      link_url: "/shop?category=bridal"
    }
  ];

  return (
    <section className="w-full max-w-[1400px] mx-auto py-8 lg:py-16 px-4 md:px-8">
      <div className={cn(
        "grid grid-cols-1 gap-6 lg:gap-8",
        displayAds.length === 2 ? 'md:grid-cols-2' : 
        displayAds.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-1'
      )}>
        {displayAds.map((ad) => (
           <Link 
             href={getAdLink(ad)}
             key={ad.id} 
             className="relative h-[400px] md:h-[500px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-lg cursor-pointer block"
           >
              {/* Auto Looping Background Video */}
              <video
                 src={getMediaUrl(ad.video_url)}
                 autoPlay
                 loop
                 muted
                 playsInline
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content / Text Layer */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 text-white">
                 <p className="font-sans text-white/80 tracking-[0.2em] text-xs md:text-sm uppercase mb-2">
                    {ad.subtitle}
                 </p>
                 <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">
                    {ad.title}
                 </h2>
                 <div className="flex items-center gap-2 group/btn w-fit">
                    <span className="font-sans text-sm font-semibold tracking-wider uppercase border-b border-white/40 pb-1 group-hover/btn:border-white transition-colors">
                       {ad.link_text || ad.linkText || "Explore"}
                    </span>
                    <MoveRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                 </div>
              </div>
           </Link>
        ))}
      </div>
    </section>
  );
}
