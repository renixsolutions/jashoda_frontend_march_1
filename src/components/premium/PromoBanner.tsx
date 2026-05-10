"use client";

import { motion } from 'framer-motion';

const PromoBanner = () => {
  return (
    <div className="w-full bg-[#131e42]">
      <section className="relative py-20 md:py-28 w-full bg-[#FFFFFF] overflow-hidden flex flex-col items-center rounded-b-[60px] md:rounded-b-[100px]">

      {/* ── Background Editorial Identity (Watermark) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1 className="text-[32vw] font-serif tracking-tighter text-black/[0.02] leading-none">
          ATELIER
        </h1>
      </div>

      {/* ── Side Decorative Elements ── */}
      <div className="hidden xl:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col items-center gap-10 z-20 opacity-30">
        <div className="w-[1px] h-20 bg-black/10" />
        <div className="[writing-mode:vertical-rl] text-[7px] uppercase tracking-[0.8em] text-black font-bold rotate-180">
          ARCHIVAL
        </div>
        <div className="w-[1px] h-20 bg-black/10" />
      </div>

      {/* ── The Monolithic Glass Plinth ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="container mx-auto px-6 md:px-0 relative z-10 max-w-5xl h-auto md:h-[480px] rounded-[32px] md:rounded-[50px] border border-black/[0.05] bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row"
      >

        {/* ── Left side: Content ── */}
        <div className="w-full md:w-1/2 p-6 md:p-16 lg:p-20 flex flex-col justify-center items-center text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="w-10 h-[1px] bg-black/20" />
              <span className="text-black/40 text-[9px] tracking-[0.4em] font-bold">Edition 01</span>
              <div className="w-10 h-[1px] bg-black/20" />
            </div>


 
            <h2 className="text-2xl md:text-5xl lg:text-7xl font-serif text-black leading-tight md:leading-[0.85] tracking-tighter mb-6 md:mb-10">
              Archival <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#C8A165] to-[#B58D4C]">geometry</span>
            </h2>



            <p className="text-black/50 text-[10px] md:text-xs font-light leading-relaxed max-w-sm mb-10 md:mb-12 tracking-[0.1em] italic">
              A collision of Rajputana heritage and modern minimalism. Hand-forged in 925 sterling to redefine the architecture of light.
            </p>


            {/* Desktop Button (Hidden on Mobile) */}
            <button className="hidden md:block group relative px-12 py-4 bg-black rounded-full text-[9px] tracking-[0.3em] text-white overflow-hidden transition-all duration-700 hover:shadow-xl w-fit">
              <span className="relative z-10 font-black">Acquire piece</span>
              <div className="absolute inset-0 bg-[#C8A165] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            </button>


          </motion.div>
        </div>

        {/* ── Right side: Product ── */}
        <div className="w-full md:w-1/2 relative flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden bg-[#FAFAFA]">
          <motion.div 
            className="relative z-20 w-full h-full flex items-center justify-center mb-8 md:mb-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src="/necklace.png"
              alt="Sculptural Silver Necklace"
              className="w-[80%] md:w-[90%] lg:w-[85%] max-w-none object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)] -translate-y-2 md:-translate-y-10 mix-blend-multiply opacity-90"
            />
          </motion.div>

          {/* Mobile Button (Visible only on Mobile) */}
          <button className="md:hidden group relative px-10 py-4 bg-black rounded-full text-[9px] tracking-[0.3em] text-white overflow-hidden transition-all duration-300 hover:shadow-xl w-fit mb-6">
            <span className="relative z-10 font-black">Acquire piece</span>
            <div className="absolute inset-0 bg-[#C8A165] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>


          {/* Metadata */}
          <div className="absolute bottom-8 right-10 text-right hidden lg:block opacity-30">
            <span className="block text-[9px] text-black uppercase tracking-[0.3em] font-bold mb-1.5">Technical Spec</span>
            <span className="block text-[11px] text-black font-serif italic">Pure Silver 925 • Artisan Form</span>
          </div>
        </div>

      </motion.div>

      {/* ── Side Decorative Elements (Right) ── */}
      <div className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-center gap-10 z-20 opacity-30">
        <div className="w-[1px] h-20 bg-black/10" />
        <div className="[writing-mode:vertical-rl] text-[7px] uppercase tracking-[0.8em] text-black font-bold">
          EST. 2024
        </div>
        <div className="w-[1px] h-20 bg-black/10" />
      </div>
      </section>
    </div>
  );
};

export default PromoBanner;
