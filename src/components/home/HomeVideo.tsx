"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HomeVideo() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden bg-black mt-[160px] md:mt-[170px]" aria-label="Welcome Video">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/video/jashoda_video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Black Gradient Overlays for readability and mood */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 z-10 bg-black/20" /> {/* Slight overall darkening vignette */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

      {/* Text Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#C8A165] font-sans uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-4"
        >
          A Legacy of Craftsmanship
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 uppercase tracking-widest leading-tight"
        >
          Welcome to <br />
          <span className="text-[#C8A165]">Jashoda Jewels</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm md:text-lg text-gray-200 font-light tracking-[0.15em] max-w-2xl mx-auto leading-relaxed"
        >
          Discover timeless elegance and uncompromised quality in every masterpiece we curate for you.
        </motion.p>
      </div>
    </section>
  );
}
