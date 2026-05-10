"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";

// ─── Luxury Editorial Data ───────────────────────────────────────────────────

const staticPromotions = [
    {
        id: 1,
        title: "Timeless Heritage",
        description: "A masterful fusion of Rajputana soul and contemporary precision. Explore the signature diamond collection designed for the modern heirloom.",
        bg_color: "bg-gradient-to-br from-[#1A1A1A] via-[#2D1B1B] to-[#1A1A1A]", // Deep Velvet Maroon
        accent_color: "text-[#F2D7A1]",
        image_url: "/diamond-pendant.png",
        secondary_image_url: "/diamond-bangle.png",
        cta_text: "DISCOVER ARCHIVAL"
    },
    {
        id: 2,
        title: "The Golden Era",
        description: "An architectural manifesto in pure 24k gold. Hand-selected pieces that defined the essence of royal luxury.",
        bg_color: "bg-gradient-to-br from-[#0C0C0C] via-[#1A1A1A] to-[#0C0C0C]", // Obsidian Charcoal
        accent_color: "text-white",
        image_url: "/gold-rings-banner.png",
        cta_text: "EXPLORE EDITION"
    }
];

// ─── Refined Animation Constants ──────────────────────────────────────────────
const spring = {
    type: "spring" as const,
    stiffness: 120,
    damping: 24,
    mass: 1.2,
};

const contentWrap = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const contentLine = {
    hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function PromoCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const lenis = useLenis();
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const response = await api.getBanners(true, 'PROMO_CAROUSEL');
                setBanners(response.success && response.data.length > 0 ? response.data : staticPromotions);
            } catch {
                setBanners(staticPromotions);
            } finally {
                setLoading(false);
                setTimeout(() => lenis?.resize(), 100);
            }
        })();
    }, [lenis]);


    const resetTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (banners.length <= 1) return;
        timerRef.current = setInterval(() => {
            setDirection(1);
            setCurrentIndex(prev => (prev + 1) % banners.length);
        }, 6000);
    };

    useEffect(() => {
        resetTimer();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [currentIndex, banners.length]);

    const go = (dir: number, idx?: number) => {
        setDirection(dir);
        setCurrentIndex(idx !== undefined ? idx : prev =>
            dir > 0 ? (prev + 1) % banners.length : (prev - 1 + banners.length) % banners.length
        );
    };

    const handleBannerClick = (banner: any) => {
        const q = new URLSearchParams();
        if (banner.category_id) q.append("category", banner.category_id);
        router.push(`/shop${q.toString() ? `?${q.toString()}` : ""}`);
    };

    if (loading) return (
        <div className="w-full h-[600px] flex items-center justify-center bg-white rounded-t-[60px] md:rounded-t-[100px]">
            <div className="w-32 h-32 border-2 border-black/5 border-t-[#C8A165] rounded-full animate-spin" />
        </div>
    );
    if (!banners.length) return null;

    return (
        <div className="w-full bg-[#FFFFFF]">
            <section className="relative w-full py-12 md:py-20 overflow-hidden flex flex-col items-center bg-[#FAFAFA] rounded-t-[60px] md:rounded-t-[100px]">

                {/* ── Background Editorial Identity ── */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <motion.h1
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.04, scale: 1 }}
                        transition={{ duration: 2 }}
                        className="text-[25vw] font-serif tracking-tighter text-black leading-none whitespace-nowrap"
                    >
                        ARCHIVE
                    </motion.h1>
                </div>

                {/* ── Technical Markers ── */}
                <div className="hidden 2xl:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col items-center gap-8 z-20 opacity-20">
                    <div className="w-[1px] h-20 bg-black" />
                    <div className="[writing-mode:vertical-rl] text-[9px] uppercase tracking-[0.8em] text-black font-bold">
                        EST. JASHODA ARCHIVE
                    </div>
                </div>

                {/* ── Carousel Viewport ── */}
                <div className="relative w-full max-w-[1700px] h-[400px] md:h-[480px] flex items-center justify-center px-6" style={{ perspective: "2000px" }}>
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        {banners.map((promo, index) => {
                            if (index !== currentIndex) return null;

                            return (
                                <motion.div
                                    key={promo.id}
                                    custom={direction}
                                    initial={{ scale: 0.95, opacity: 0, z: -150, rotateX: 5 }}
                                    animate={{ scale: 1, opacity: 1, z: 0, rotateX: 0 }}
                                    exit={{ scale: 1.05, opacity: 0, z: 100, filter: "blur(15px)" }}
                                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                                    className={`absolute w-full md:w-[85%] h-full rounded-[50px] overflow-hidden flex flex-col items-center justify-center p-8 md:p-16 ${promo.bg_color || 'bg-[#1A1A1A]'} shadow-[0_60px_120px_-30px_rgba(0,0,0,0.45)]`}
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    {/* Archival Texture Layer */}
                                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

                                    {/* Ambient Light Bloom */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                                    {/* Side Images - Immediate Visibility */}
                                    <div className="hidden lg:block absolute left-6 xl:left-10 top-1/2 -translate-y-1/2 w-[18%] h-[75%] z-20 pointer-events-none">
                                        <img
                                            src={api.getMediaUrl(promo.secondary_image_url || promo.image_url)}
                                            alt=""
                                            className="object-contain w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                        />
                                    </div>

                                    <div className="hidden lg:block absolute right-6 xl:right-10 top-1/2 -translate-y-1/2 w-[18%] h-[75%] z-20 pointer-events-none">
                                        <img
                                            src={api.getMediaUrl(promo.image_url)}
                                            alt=""
                                            className="object-contain w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                        />
                                    </div>





                                    {/* Center Editorial Content - Narrower for more Gap */}
                                    <div className="relative z-30 flex flex-col items-center text-center max-w-xl px-6">
                                        <motion.div
                                            variants={contentWrap}
                                            initial="hidden"
                                            animate="show"
                                            className="flex flex-col items-center"
                                        >
                                            <motion.div variants={contentLine} className="flex flex-col items-center mb-6">
                                                {/* Mobile Image */}
                                                <div className="lg:hidden w-full h-56 mb-8 flex justify-center">
                                                    <img
                                                        src={api.getMediaUrl(promo.image_url)}
                                                        alt=""
                                                        className="object-contain h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                                                    />
                                                </div>

                                                <span className={`text-[10px] tracking-[0.4em] ${promo.accent_color || 'text-white/60'} font-bold`}>
                                                    Jashoda originals
                                                </span>
                                                <div className="w-16 h-[1px] bg-[#C8A165]/50 mt-4" />
                                            </motion.div>



                                            <motion.h2 
                                                variants={contentLine} 
                                                className={`font-serif text-3xl md:text-4xl lg:text-5xl mb-6 leading-[1.2] tracking-normal bg-gradient-to-b from-[#FFFFFF] via-[#F2D7A1] to-[#C8A165] bg-clip-text text-transparent italic drop-shadow-sm`}
                                            >
                                                {promo.title.charAt(0).toUpperCase() + promo.title.slice(1).toLowerCase()}
                                            </motion.h2>



                                            <motion.p 
                                                variants={contentLine} 
                                                className="text-white/60 text-xs md:text-sm max-w-md mb-10 font-light leading-relaxed tracking-wide italic"
                                            >
                                                {promo.description}
                                            </motion.p>

                                            <motion.div variants={contentLine}>
                                                <button
                                                    onClick={() => handleBannerClick(promo)}
                                                    className="group relative px-14 py-5 bg-white text-black text-[11px] tracking-[0.3em] font-bold hover:bg-[#C8A165] hover:text-white transition-all duration-700 overflow-hidden shadow-xl"
                                                >
                                                    <span className="relative z-10">
                                                        {promo.cta_text 
                                                            ? (promo.cta_text.charAt(0).toUpperCase() + promo.cta_text.slice(1).toLowerCase()) 
                                                            : 'Discover archive'}
                                                    </span>
                                                    <motion.div
                                                        className="absolute inset-0 bg-[#C8A165] translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                                                    />
                                                </button>
                                            </motion.div>

                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {/* Minimalist Glass Navigation */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10 z-40 pointer-events-none">
                        <button
                            onClick={() => go(-1)}
                            className="pointer-events-auto p-4 rounded-full border border-black/5 bg-white/10 backdrop-blur-xl hover:bg-white hover:scale-110 transition-all duration-500 shadow-lg"
                        >
                            <ChevronLeft size={22} className="text-black" />
                        </button>
                        <button
                            onClick={() => go(1)}
                            className="pointer-events-auto p-4 rounded-full border border-black/5 bg-white/10 backdrop-blur-xl hover:bg-white hover:scale-110 transition-all duration-500 shadow-lg"
                        >
                            <ChevronRight size={22} className="text-black" />
                        </button>
                    </div>
                </div>

                {/* Coordinated Pagination Lines */}
                <div className="flex gap-6 mt-16 z-30">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => go(idx > currentIndex ? 1 : -1, idx)}
                            className="group flex flex-col items-center"
                        >
                            <div className={`h-[2px] transition-all duration-700 ${idx === currentIndex ? 'w-20 bg-black' : 'w-10 bg-black/10 group-hover:bg-black/30'}`} />
                            <span className={`text-[8px] mt-2 font-bold transition-opacity duration-500 ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                                0{idx + 1}
                            </span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
