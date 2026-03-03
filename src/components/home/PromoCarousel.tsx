"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const promotions = [
    {
        id: 1,
        title: "Season Of Style '25",
        subtitle: "A TATA PRODUCT", // Keeping the style but maybe changing text if strictly needed, user asked "these advertise type card" implying the design. I will use "Jashoda Jewels" to match the site context.
        brandText: "Jashoda Jewels",
        description: "From India's most loved designs that captured hearts, a tribute to the elegance and joy that defined the year.",
        image: "/sil1.png", // Placeholder
        cta: "EXPLORE NOW",
        bgColor: "bg-[#F9F4F0]", // Light creamy/paper background like in image
        accentColor: "text-[#8B5E3C]", // Brownish/Gold text color from image
    },
    {
        id: 2,
        title: "Timeless Elegance",
        brandText: "Jashoda Jewels",
        description: "Discover the perfect blend of tradition and modernity with our exclusive diamond collection.",
        image: "/sil1.png",
        cta: "SHOP COLLECTION",
        bgColor: "bg-[#F0F4F8]", // Light sliver/blueish background
        accentColor: "text-[#2C3E50]",
    },
    {
        id: 3,
        title: "Wedding Bliss",
        brandText: "Jashoda Jewels",
        description: " celebrate your special day with jewelry that shines as bright as your love.",
        image: "/sil1.png",
        cta: "VIEW DESIGNS",
        bgColor: "bg-[#FFF0F5]", // Light pinkish background
        accentColor: "text-[#8B0000]",
    },
];

export default function PromoCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % promotions.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
    };

    return (
        <section className="relative w-full py-12 overflow-hidden flex flex-col items-center">
            <div className="relative w-full max-w-[1400px] h-[500px] flex items-center justify-center">
                {/* Carousel Container */}
                <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                    <AnimatePresence initial={false} mode="popLayout">
                        {promotions.map((promo, index) => {
                            // Calculate relative position for circular buffer effect
                            // This basic logic handles 3 items well. For more, need robust logic.
                            // Assuming 3 items for simplicity as per "these advertise type card" usually implies a limited set or just the style.

                            let position = 0; // 0 = active, 1 = next, -1 = prev
                            if (index === currentIndex) position = 0;
                            else if (index === (currentIndex + 1) % promotions.length) position = 1;
                            else if (index === (currentIndex - 1 + promotions.length) % promotions.length) position = -1;
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
                                        x: position === 0 ? "0%" : position === 1 ? "85%" : "-85%", // 85% to show partial
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
                                    className={`absolute top-0 w-[85%] md:w-[60%] h-full rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-12 bg-white/40 backdrop-blur-lg border border-white/40`}
                                >
                                    {/* Background Texture/Decorations could go here */}

                                    {/* Left Jewelry Image */}
                                    <div className="hidden md:block w-1/4 h-full relative">
                                        <img src={promo.image} alt="Jewelry Left" className="object-contain w-full h-full transform -scale-x-100 drop-shadow-lg" />
                                    </div>

                                    {/* Center Content */}
                                    <div className="flex-1 flex flex-col items-center text-center z-10 space-y-4">
                                        <div className="flex flex-col items-center">
                                            {/* Logo / Brand */}
                                            <h3 className={`font-serif text-xl tracking-widest uppercase ${promo.accentColor} mb-2`}>{promo.brandText}</h3>
                                            <div className={`w-12 h-[1px] ${promo.accentColor} opacity-50 mb-4`}></div>
                                        </div>

                                        <h2 className={`font-serif text-4xl md:text-5xl lg:text-6xl ${promo.accentColor} italic`}>
                                            {promo.title}
                                        </h2>

                                        <p className={`font-sans text-sm md:text-base ${promo.accentColor} max-w-md opacity-80 leading-relaxed`}>
                                            {promo.description}
                                        </p>

                                        <Button
                                            className={`mt-6 px-8 py-3 bg-[#C8A165] text-white font-serif uppercase tracking-wider text-sm hover:bg-[#B08D55] shadow-lg rounded-none`}
                                            variant="primary" // Overridden by className but keeps prop happy if needed
                                        >
                                            {promo.cta}
                                        </Button>
                                    </div>

                                    {/* Right Jewelry Image */}
                                    <div className="hidden md:block w-1/4 h-full relative">
                                        <img src={promo.image} alt="Jewelry Right" className="object-contain w-full h-full drop-shadow-lg" />
                                    </div>

                                    {/* Mobile Image (shown only on small screens) */}
                                    <div className="md:hidden w-full h-40 relative mt-4">
                                        <img src={promo.image} alt="Jewelry" className="object-contain w-full h-full drop-shadow-md" />
                                    </div>

                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Navigation Arrows */}
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
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-3 mt-8">
                {promotions.map((_, idx) => (
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
        </section>
    );
}
