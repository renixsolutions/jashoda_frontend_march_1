"use client";

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDES = [
  {
    id: 1,
    video: "/video1",
    title: "Masterful Precision",
    subtitle: "The Art of the Atelier",
    description: "Every curve is a conversation between the artisan and the silver."
  },
  {
    id: 2,
    video: "/video2.mp4",
    title: "Timeless Brilliance",
    subtitle: "A Legacy Reimagined",
    description: "Honoring a century of craftsmanship with modern architectural fluidity."
  }
]

const VideoSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative py-16 md:py-24 w-full bg-[#09090B] overflow-hidden flex flex-col items-center justify-center">

      {/* ── Ambient Video Light Reflection ── */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none" />

      {/* ── Large Cinematic Video Showcase ── */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">

        <div className="relative w-full max-w-[98vw] md:max-w-[1700px] h-[55vh] md:h-[75vh] rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-white/5 group">

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Subtle dynamic overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <video
                src={SLIDES[currentSlide].video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>

          {/* Content Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-20 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="max-w-2xl"
              >
                <span className="text-[10px] md:text-[12px] uppercase tracking-[0.8em] text-white/60 font-bold mb-6 block">
                  {SLIDES[currentSlide].subtitle}
                </span>
                <h2 className="text-3xl md:text-7xl font-serif italic text-white mb-8 tracking-tight">
                  {SLIDES[currentSlide].title}
                </h2>

                <p className="text-white/40 text-xs md:text-sm max-w-md leading-relaxed font-light tracking-widest uppercase">
                  {SLIDES[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Progress & Controls ── */}
        <div className="mt-16 flex items-center gap-10">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group relative flex flex-col items-start gap-4 transition-all duration-300"
            >
              <div className="w-24 md:w-40 h-[1px] bg-white/10 overflow-hidden relative">
                <motion.div
                  initial={false}
                  animate={{ x: currentSlide === index ? "0%" : "-100%" }}
                  transition={{ duration: currentSlide === index ? 10 : 0.3, ease: "linear" }}
                  className="w-full h-full bg-white/60"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold tracking-[0.3em] transition-colors duration-500 ${currentSlide === index ? 'text-white' : 'text-white/20'}`}>
                  0{index + 1}
                </span>
                <span className={`text-[9px] uppercase tracking-[0.2em] font-medium transition-all duration-500 ${currentSlide === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                  Chapter
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#09090B] to-transparent z-30 pointer-events-none" />

    </section>
  )
}

export default VideoSlideshow
