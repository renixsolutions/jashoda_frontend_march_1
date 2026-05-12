"use client";

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { HERO_SLIDES } from './slides'
import Magnetic from './Magnetic'
import RotatingLogo from './RotatingLogo'
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

const PremiumHero = () => {
  const [banners, setBanners] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const router = useRouter()

  const { scrollY } = useScroll()
  const scale = useTransform(scrollY, [0, 600], [1, 1.15])
  const imageOpacity = useTransform(scrollY, [0, 600], [0.8, 0.4])

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.getBanners(true, 'MAIN_HERO')
        if (response.success && response.data.length > 0) {
          setBanners(response.data)
        } else {
          // Fallback to static slides if no banners found in DB
          setBanners(HERO_SLIDES.map(s => ({
            ...s,
            title: s.name,
            brand_text: s.category,
            image_url: s.image,
            cta_text: "View Masterpiece"
          })))
        }
      } catch (error) {
        console.error("Error fetching hero banners:", error)
        setBanners(HERO_SLIDES.map(s => ({
          ...s,
          title: s.name,
          brand_text: s.category,
          image_url: s.image,
          cta_text: "View Masterpiece"
        })))
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  const paginate = (newDirection: number) => {
    if (isAnimating || banners.length <= 1) return
    setImageError(false)
    setDirection(newDirection)
    setCurrentSlide((prev) => (prev + newDirection + banners.length) % banners.length)
  }

  useEffect(() => {
    if (isAnimating || banners.length <= 1) return
    const timer = setInterval(() => {
      paginate(1)
    }, 8000)
    return () => clearInterval(timer)
  }, [currentSlide, isAnimating, banners.length])

  useEffect(() => {
    if (titleRef.current && banners[currentSlide]) {
      const text = banners[currentSlide].title || banners[currentSlide].name || ""
      titleRef.current.innerHTML = text.split('').map((char: string) =>
        `<span class="char inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('')

      gsap.fromTo(titleRef.current.querySelectorAll('.char'),
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.03, duration: 1, ease: "power4.out", delay: 0.5 }
      )
    }
  }, [currentSlide, banners])

  const handleBannerClick = () => {
    const banner = banners[currentSlide]
    if (!banner) return

    const params = new URLSearchParams()
    if (banner.category_id) params.append('category', banner.category_id)
    if (banner.subcategory_id) params.append('subcategory', banner.subcategory_id)
    if (banner.gender_id) params.append('gender', banner.gender_id)
    if (banner.occasion_id) params.append('occasion', banner.occasion_id)

    const queryString = params.toString()
    router.push(`/shop${queryString ? `?${queryString}` : ''}`)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      filter: "blur(40px)",
      scale: 1.5,
      opacity: 0,
      x: direction > 0 ? '20%' : '-20%',
    }),
    center: {
      zIndex: 1,
      filter: "blur(0px)",
      scale: 1,
      opacity: 1,
      x: 0,
      transition: {
        filter: { duration: 1.5, ease: "easeOut" },
        scale: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 1 },
        x: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
      } as any
    },
    exit: (direction: number) => ({
      zIndex: 0,
      filter: "blur(40px)",
      scale: 0.8,
      opacity: 0,
      x: direction < 0 ? '20%' : '-20%',
      transition: {
        filter: { duration: 1.2, ease: "easeIn" },
        scale: { duration: 1.2, ease: "easeIn" },
        opacity: { duration: 0.8 },
        x: { duration: 1.2, ease: "easeIn" }
      } as any
    })
  }

  if (loading) {
    return (
      <section className="relative h-[96vh] w-[98%] mx-auto mt-2 md:mt-4 rounded-t-[32px] md:rounded-t-[64px] overflow-hidden bg-[#09090B] flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-white/5 border-t-white rounded-full animate-spin" />
      </section>
    )
  }

  if (banners.length === 0) return null

  return (
    <section className="relative h-[96vh] w-[98%] mx-auto mt-2 md:mt-4 rounded-t-[32px] md:rounded-t-[64px] overflow-hidden bg-[#09090B] z-0 shadow-2xl">
      <AnimatePresence initial={false} custom={direction} onExitComplete={() => setIsAnimating(false)}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          onAnimationStart={() => setIsAnimating(true)}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0 bg-[#09090B]">
            {!imageError ? (
              <motion.img
                src={api.getMediaUrl(banners[currentSlide].image_url || banners[currentSlide].image)}
                alt={banners[currentSlide].title || banners[currentSlide].name}
                onError={() => setImageError(true)}
                style={{ scale, opacity: imageOpacity }}
                className="w-full h-full object-cover transition-all duration-[3000ms]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 opacity-60" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-[#09090B]" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "1em" }}
              transition={{ duration: 2, delay: 0.5 }}
              className="mb-8"
            >
              <span className="text-white/60 text-[10px] md:text-xs uppercase font-black tracking-[1em]">
                {banners[currentSlide].brand_text || banners[currentSlide].category}
              </span>
            </motion.div>

            <div className="overflow-hidden mb-6">
              <h1
                ref={titleRef}
                className="text-[10vw] md:text-[8vw] font-serif italic text-white leading-tight tracking-tight px-4"
              >
                {banners[currentSlide].title || banners[currentSlide].name}
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1.2 }}
              className="text-neutral-400 text-xs md:text-sm max-w-lg mx-auto font-light tracking-[0.2em] leading-relaxed mb-16 italic"
            >
              {banners[currentSlide].description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1 }}
            >
              <Magnetic>
                <button 
                  onClick={handleBannerClick}
                  className="group relative px-12 py-4 rounded-full border border-white/20 text-white uppercase text-[9px] tracking-[0.5em] font-bold overflow-hidden transition-all duration-700 hover:border-white"
                >
                  <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                    {banners[currentSlide].cta_text || "View Masterpiece"}
                  </span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                </button>
              </Magnetic>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <RotatingLogo />

      {/* Curved Floating Slider Navigation */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 w-full px-6 flex justify-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="flex items-center gap-1.5 md:gap-3 p-2 bg-black/30 backdrop-blur-3xl border border-white/5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[90vw] md:max-w-full overflow-hidden"
        >
          {/* Mobile View: Single Category with Arrows */}
          <div className="flex md:hidden items-center w-full px-2 min-w-[200px] justify-between">
            <button
              onClick={() => paginate(-1)}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>

            <div className="flex flex-col items-center">
              <span className="text-[8px] uppercase tracking-[0.3em] font-black text-white/40 mb-0.5">
                0{currentSlide + 1}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentSlide}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[10px] tracking-[0.2em] font-bold text-white whitespace-nowrap"
                >
                  {banners[currentSlide].title || banners[currentSlide].name}
                </motion.span>
              </AnimatePresence>
            </div>

            <button
              onClick={() => paginate(1)}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          {/* Desktop View: Full List */}
          <div className="hidden md:flex items-center gap-3">
            {banners.map((slide, index) => (
              <button
                key={slide.id || index}
                onClick={() => {
                  if (currentSlide === index) return
                  setDirection(index > currentSlide ? 1 : -1)
                  setCurrentSlide(index)
                }}
                className="relative px-7 py-1.5 rounded-full transition-all duration-700 group flex flex-col items-center min-w-[130px]"
              >
                {currentSlide === index && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm"
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  />
                )}

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[1.5px] bg-white/5 overflow-hidden rounded-full">
                  <motion.div
                    initial={false}
                    animate={{
                      width: currentSlide === index ? "100%" : "0%",
                      transition: { duration: currentSlide === index ? 8 : 0.5, ease: "linear" }
                    }}
                    className="absolute inset-0 bg-white shadow-[0_0_10px_#fff]"
                  />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <span className={`text-[10px] uppercase tracking-[0.3em] font-black mb-0.5 transition-colors ${currentSlide === index ? 'text-white' : 'text-neutral-600'}`}>
                    0{index + 1}
                  </span>
                  <span className={`text-[12px] tracking-[0.2em] font-bold transition-all whitespace-nowrap ${currentSlide === index ? 'text-white translate-y-0' : 'text-neutral-500 group-hover:text-neutral-300 group-hover:-translate-y-0.5'}`}>
                    {slide.title || slide.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative Side Elements */}
      <div className="hidden md:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col items-center gap-20 z-30 opacity-30">
        <div className="[writing-mode:vertical-rl] text-[8px] uppercase tracking-[1em] text-white font-bold">
          SILVER HERITAGE
        </div>
        <div className="w-[1px] h-40 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  )
}

export default PremiumHero
