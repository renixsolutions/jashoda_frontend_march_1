"use client";

import React from "react";
import { MoveRight } from "lucide-react";

// You can add up to 3 videos here by expanding the array. 
const videoAds = [
  {
    id: 1,
    title: "Signature Collection",
    subtitle: "Brilliance in Motion",
    video: "/hero-video.mp4", // Automatically loops
    linkText: "Explore Collection",
  },
  {
    id: 2,
    title: "Bridal Exclusives",
    subtitle: "Your Perfect Match",
    video: "/hero-video.mp4", // Replace with your second video path
    linkText: "Shop Bridal",
  },
];

export default function VideoAdCards() {
  return (
    <section className="w-full max-w-[1400px] mx-auto py-8 lg:py-16 px-4 md:px-8">
      {/* Defines grid based on how many videos you place in the array above */}
      <div className={`grid grid-cols-1 ${videoAds.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 lg:gap-8`}>
        {videoAds.map((ad) => (
           <div 
             key={ad.id} 
             className="relative h-[400px] md:h-[500px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-lg cursor-pointer"
           >
              {/* Auto Looping Background Video */}
              <video
                 src={ad.video}
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
                       {ad.linkText}
                    </span>
                    <MoveRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                 </div>
              </div>
           </div>
        ))}
      </div>
    </section>
  );
}
