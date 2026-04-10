"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function PromoCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await api.getBanners(true, 'PROMO_CAROUSEL');
                if (response.success && response.data.length > 0) {
                    setBanners(response.data);
                } else {
                    // Fallback to static if no data in DB yet
                    // setBanners(staticPromotions); 
                }
            } catch (error) {
                console.error("Failed to fetch banners", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Auto-advance
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex, banners.length]);

    const handleNext = () => {
        if (banners.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const handlePrev = () => {
        if (banners.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const handleBannerClick = (banner: any) => {
        const queryParams = new URLSearchParams();
        if (banner.category_id) queryParams.append("category", banner.category_id);
        if (banner.subcategory_id) queryParams.append("subcategory", banner.subcategory_id);
        if (banner.gender_id) queryParams.append("gender", banner.gender_id);
        if (banner.occasion_id) queryParams.append("occasion", banner.occasion_id);

        const queryString = queryParams.toString();
        router.push(`/shop${queryString ? `?${queryString}` : ""}`);
    };

    if (loading) {
        return (
            <div className="w-full py-24 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-64 h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="w-96 h-4 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (banners.length === 0) return null;

    return (
        <section className="relative w-full py-12 overflow-hidden flex flex-col items-center">
            <div className="relative w-full max-w-[1400px] h-[500px] flex items-center justify-center">
                {/* Carousel Container */}
                <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                    <AnimatePresence initial={false} mode="popLayout">
                        {banners.map((promo, index) => {
                            let position = 0; // 0 = active, 1 = next, -1 = prev
                            if (index === currentIndex) position = 0;
                            else if (index === (currentIndex + 1) % banners.length) position = 1;
                            else if (index === (currentIndex - 1 + banners.length) % banners.length) position = -1;
                            else position = 2; // Hidden

                            if (position === 2) return null;

                            const isCenter = position === 0;

                            return (
                                <motion.div
                                    key={promo.id}
                                    layout
                                    initial={{
                                        scale: 0.8,
                                        x: position === 1 ? "100%" : position === -1 ? "-100%" : 0,
                                        opacity: 0,
                                        zIndex: 0
                                    }}
                                    animate={{
                                        scale: isCenter ? 1 : 0.85,
                                        x: position === 0 ? "0%" : position === 1 ? "85%" : "-85%",
                                        opacity: isCenter ? 1 : 0.5,
                                        zIndex: isCenter ? 10 : 1,
                                        filter: isCenter ? "blur(0px)" : "blur(4px)",
                                    }}
                                    exit={{
                                        scale: 0.8,
                                        opacity: 0,
                                        zIndex: 0
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.32, 0.72, 0, 1]
                                    }}
                                    className={`absolute top-0 w-[85%] md:w-[60%] h-full rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-12 ${promo.bg_color || 'bg-white/40'} backdrop-blur-lg border border-white/40`}
                                >
                                    {/* Left Jewelry Image / Secondary Image */}
                                    <div className="hidden md:block w-1/4 h-full relative">
                                        <img 
                                            src={api.getMediaUrl(promo.secondary_image_url || promo.image_url)} 
                                            alt="Jewelry Left" 
                                            className="object-contain w-full h-full transform -scale-x-100 drop-shadow-lg" 
                                        />
                                    </div>

                                    {/* Center Content */}
                                    <div className="flex-1 flex flex-col items-center text-center z-10 space-y-4">
                                        <div className="flex flex-col items-center">
                                            {/* Logo / Brand */}
                                            <h3 className={`font-serif text-xl tracking-widest uppercase ${promo.accent_color || 'text-[#8B5E3C]'} mb-2`}>{promo.brand_text || 'Jashoda Jewels'}</h3>
                                            <div className={`w-12 h-[1px] ${promo.accent_color || 'text-[#8B5E3C]'} opacity-50 mb-4`}></div>
                                        </div>

                                        <h2 className={`font-serif text-4xl md:text-5xl lg:text-6xl ${promo.accent_color || 'text-[#8B5E3C]'} italic`}>
                                            {promo.title}
                                        </h2>

                                        <p className={`font-sans text-sm md:text-base ${promo.accent_color || 'text-[#8B5E3C]'} max-w-md opacity-80 leading-relaxed`}>
                                            {promo.description}
                                        </p>

                                        <Button
                                            onClick={() => handleBannerClick(promo)}
                                            className={`mt-6 px-8 py-3 bg-[#C8A165] text-white font-serif uppercase tracking-wider text-sm hover:bg-[#B08D55] shadow-lg rounded-none`}
                                            variant="primary"
                                        >
                                            {promo.cta_text || 'EXPLORE NOW'}
                                        </Button>
                                    </div>

                                    {/* Right Jewelry Image */}
                                    <div className="hidden md:block w-1/4 h-full relative">
                                        <img src={api.getMediaUrl(promo.image_url)} alt="Jewelry Right" className="object-contain w-full h-full drop-shadow-lg" />
                                    </div>

                                    {/* Mobile Image (shown only on small screens) */}
                                    <div className="md:hidden w-full h-40 relative mt-4">
                                        <img src={api.getMediaUrl(promo.image_url)} alt="Jewelry" className="object-contain w-full h-full drop-shadow-md" />
                                    </div>

                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows */}
                {banners.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 md:left-12 z-20 p-2 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-sm transition-all text-white border border-white/20 hidden md:block"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 md:right-12 z-20 p-2 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-sm transition-all text-white border border-white/20 hidden md:block"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </>
                )}
            </div>

            {/* Pagination Dots */}
            {banners.length > 1 && (
                <div className="flex gap-3 mt-8">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`transition-all duration-300 ${idx === currentIndex
                                ? "w-8 h-2 bg-[#C8A165]"
                                : "w-2 h-2 bg-white/40 hover:bg-white/60"
                                } rounded-full`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

