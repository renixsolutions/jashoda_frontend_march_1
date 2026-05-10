"use client";

import { motion } from 'framer-motion'

const MARQUEE_TEXT = [
  "PURE STERLING 925",
  "ARCHITECTURAL PRECISION",
  "MODERN HERITAGE",
  "JASHODA ATELIER",
  "HAND-CRAFTED EXCELLENCE",
  "LUXURY REIMAGINED"
]

const TextMarquee = () => {
  return (
    <div className="relative py-8 bg-[#09090B] overflow-hidden border-y border-white/5">

      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="flex whitespace-nowrap gap-24 items-center"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-24 items-center">
            {MARQUEE_TEXT.map((text, idx) => (
              <div key={idx} className="flex items-center gap-24">
                <span className="text-xs md:text-sm uppercase tracking-[0.8em] font-bold text-white/50 hover:text-white transition-all duration-700 cursor-default select-none">
                  {text}
                </span>
                <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default TextMarquee
