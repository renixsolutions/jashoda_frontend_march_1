"use client";

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigation } from "@/contexts/NavigationContext"
import { getMediaUrl } from "@/lib/api"
import { useRouter } from 'next/navigation'

const glowColors = [
  "#1E3A8A", // 0: Deep Sapphire
  "#064E3B", // 1: Forest Emerald
  "#A68F7B", // 2: Champagne Gold (Atelier)
  "#3A3025", // 3: Deep Bronze
  "#4A0E4E", // 4: Deep Purple
  "#8B0000", // 5: Dark Red
  "#2F4F4F", // 6: Dark Slate Gray
  "#8B4513", // 7: Saddle Brown
]

const BentoShowcase = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)
  const { categories, loading } = useNavigation()
  const router = useRouter()

  if (loading && categories.length === 0) {
    return (
      <section className="py-20 md:py-32 bg-gradient-to-b from-[#09090B] via-[#09090B] to-[#050505] min-h-[800px] flex items-center justify-center">
         <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </section>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section id="silver-gallery" className="py-20 md:py-32 bg-gradient-to-b from-[#09090B] via-[#09090B] to-[#050505] overflow-hidden relative transition-colors duration-1000">

      {/* ── Dynamic Ambient Reflection: Global Section Light ── */}
      <motion.div
        animate={{
          backgroundImage: `radial-gradient(circle at center, ${glowColors[hoveredIndex % glowColors.length]}20 0%, transparent 70%)`
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none z-0 opacity-60"
      />

      <div className="container mx-auto px-6 md:px-12 xl:px-20 relative z-10">

        {/* Header */}
        <div className="mb-20 flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-[12px] tracking-[0.4em] text-white/40 font-bold block mb-6"
          >
            The silver archive
          </motion.span>


          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-7xl lg:text-8xl font-serif italic text-white leading-tight mb-8"
          >
            Architectural <span className="text-white/60">Fluidity</span>
          </motion.h2>


          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-[1px] bg-white/10" />
            <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold">
              (Hover For Full View)
            </span>
            <div className="w-12 h-[1px] bg-white/10" />
          </motion.div>
        </div>

        {/* ── Interactive Accordion Gallery ── */}
        <div className="flex flex-col md:flex-row w-full h-[800px] md:h-[600px] xl:h-[700px] gap-3 md:gap-4">
          {categories.map((category, index) => {
            const isActive = hoveredIndex === index;
            const imageUrl = category.image_url ? getMediaUrl(category.image_url) : (category.image ? getMediaUrl(category.image) : '/placeholder.png');

            return (
              <motion.div
                key={category.id}
                onHoverStart={() => setHoveredIndex(index)}
                onClick={() => {
                  if (!isActive) {
                    setHoveredIndex(index);
                  } else {
                    router.push(`/shop?category=${category.slug}`);
                  }
                }}
                animate={{
                  flex: isActive ? 3 : 1
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full overflow-hidden rounded-2xl md:rounded-[2rem] cursor-pointer group bg-[#111113] border border-white/5 shadow-2xl"
              >

                {/* Background Image */}
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  animate={{ scale: isActive ? 1 : 1.2 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/50 to-transparent opacity-90" />
                </motion.div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-center pointer-events-none">

                  {/* Vertical text when inactive */}
                  <motion.div
                    className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    animate={{ opacity: isActive ? 0 : 1, scale: isActive ? 0.9 : 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-4 -rotate-90 whitespace-nowrap origin-center">
                      <span className="text-white/20 font-serif italic text-2xl">0{index + 1}</span>
                      <span className="text-white/40 tracking-[0.2em] text-[10px] font-bold uppercase">{category.name}</span>
                    </div>

                  </motion.div>

                  {/* Horizontal expanded content */}
                  <motion.div
                    animate={{
                      opacity: isActive ? 1 : 0,
                      y: isActive ? 0 : 30
                    }}
                    transition={{ duration: 0.6, delay: isActive ? 0.2 : 0, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full pointer-events-auto"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-white/40 font-serif italic text-xl">0{index + 1}</span>
                      <div className="h-[1px] w-10 bg-white/20" />
                      <span className="text-[9px] tracking-[0.2em] text-white/60 font-bold uppercase">Collection</span>

                    </div>

                    <h3 className="text-2xl md:text-5xl lg:text-6xl font-serif text-white italic mb-4 whitespace-nowrap overflow-hidden text-ellipsis">
                      {category.name}
                    </h3>

                    <div className="overflow-hidden">
                      <motion.p
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                        transition={{ duration: 0.5, delay: isActive ? 0.3 : 0 }}
                        className="text-white/40 text-xs md:text-base leading-relaxed max-w-sm md:max-w-md italic tracking-wider line-clamp-3"
                      >
                        Discover our exquisite collection of {category.name.toLowerCase()}, crafted with unparalleled precision and architectural fluidity.
                      </motion.p>
                    </div>

                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                      transition={{ duration: 0.5, delay: isActive ? 0.4 : 0 }}
                      className="mt-6 md:mt-8 flex items-center gap-4"
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); router.push(`/shop?category=${category.slug}`) }}
                        className="group/btn flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white font-bold cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-300">
                          <span className="text-sm">→</span>
                        </div>
                        <span className="group-hover/btn:text-white/60 transition-colors">Discover</span>
                      </button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-24 flex justify-center"
        >
          <button 
            onClick={() => router.push('/shop')}
            className="group flex items-center gap-6 text-white uppercase text-[10px] tracking-[0.5em] font-bold cursor-pointer"
          >
            View Complete Exhibition
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
              <span className="text-lg">→</span>
            </div>
          </button>
        </motion.div>

      </div>
    </section>
  )
}

export default BentoShowcase

