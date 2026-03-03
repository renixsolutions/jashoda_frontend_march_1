"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, VolumeX, MoreVertical, ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STORIES = [
    {
        id: 1,
        title: "Styling Diamonds",
        subtitle: "WITH SHIBANI",
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600&h=1000",
        product: {
            name: "Exquisite Vines Diamond Necklace Set",
            image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=200&h=200",
        },
    },
    {
        id: 2,
        title: "Royal Heritage",
        subtitle: "THE COLLECTION",
        image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8dad5?auto=format&fit=crop&q=80&w=600&h=1000",
        product: {
            name: "Regal Emerald Drop Earrings",
            image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=200&h=200",
        },
    },
    {
        id: 3,
        title: "Modern Minimalist",
        subtitle: "DAILY WEAR",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600&h=1000",
        product: {
            name: "Sleek Gold Chain Bracelet",
            image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=200&h=200",
        },
    },
    {
        id: 4,
        title: "Wedding Vows",
        subtitle: "FOREVER YOURS",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600&h=1000",
        product: {
            name: "Solitaire Engagement Ring",
            image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=200&h=200",
        },
    },
    {
        id: 5,
        title: "Golden Hour",
        subtitle: "SUNSET EDITIONS",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600&h=1000",
        product: {
            name: "Vintage Silver Anklet",
            image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=200&h=200",
        },
    },
];

export default function VideoStories() {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextStory = () => {
        setActiveIndex((prev) => (prev + 1) % STORIES.length);
    };

    const prevStory = () => {
        setActiveIndex((prev) => (prev - 1 + STORIES.length) % STORIES.length);
    };

    const getCardStyle = (index: number) => {
        const diff = (index - activeIndex + STORIES.length) % STORIES.length;
        // Adjust logic to handle circular scrolling visual correctly for small lists
        // We want centered item to be 0. Items to left are negative, right are positive.

        // Simplification for standard coverflow feeling with 5 items
        let normalizedDiff = index - activeIndex;
        if (normalizedDiff < -2) normalizedDiff += STORIES.length;
        if (normalizedDiff > 2) normalizedDiff -= STORIES.length;

        const isActive = normalizedDiff === 0;
        const isLeft = normalizedDiff < 0;
        const isRight = normalizedDiff > 0;
        const absDiff = Math.abs(normalizedDiff);

        return {
            x: isActive ? "0%" : isLeft ? `-${60 + (absDiff * 10)}%` : `${60 + (absDiff * 10)}%`,
            scale: isActive ? 1 : 1 - (absDiff * 0.15),
            zIndex: 10 - absDiff,
            opacity: isActive ? 1 : 0.6 - (absDiff * 0.1),
            rotateY: isActive ? 0 : isLeft ? 15 : -15,
            filter: isActive ? "blur(0px)" : `blur(${absDiff * 2}px) brightness(${100 - (absDiff * 15)}%)`,
        };
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#702540] via-[#8a3052] to-[#5c1c33] bg-[length:400%_400%] animate-gradient-xy opacity-90" />

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 px-4">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Stories & Styles</h2>
                    <p className="text-white/80 max-w-lg mx-auto">Trendsetting diamond jewellery suited for every occasion</p>
                </div>

                <div className="relative h-[600px] flex items-center justify-center perspective-1000">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevStory}
                        className="absolute left-4 md:left-20 z-50 p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all disabled:opacity-50"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextStory}
                        className="absolute right-4 md:right-20 z-50 p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Cards */}
                    <div className="relative w-full max-w-5xl mx-auto h-full flex items-center justify-center">
                        {STORIES.map((story, index) => {
                            const style = getCardStyle(index);
                            const isActive = index === activeIndex;

                            return (
                                <motion.div
                                    key={story.id}
                                    className={cn(
                                        "absolute w-[300px] md:w-[350px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl cursor-pointer bg-charcoal border border-white/10",
                                        isActive ? "cursor-default" : "cursor-pointer"
                                    )}
                                    initial={false}
                                    animate={style}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    onClick={() => setActiveIndex(index)}
                                    style={{
                                        transformStyle: "preserve-3d",
                                    }}
                                >
                                    {/* Story Content (Only fully visible if active) */}
                                    <div className="relative h-full w-full">
                                        <img
                                            src={story.image}
                                            alt={story.title}
                                            className="h-full w-full object-cover"
                                        />

                                        {/* Overlays - Only active */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-black/20"
                                                >
                                                    {/* Top Bar */}
                                                    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center text-white/90 z-20">
                                                        <div className="flex gap-1 h-1 w-full max-w-[100px]">
                                                            <div className="h-full w-full bg-white/40 rounded-full overflow-hidden">
                                                                <div className="h-full w-1/2 bg-white rounded-full" />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <VolumeX className="w-5 h-5" />
                                                            <MoreVertical className="w-5 h-5" />
                                                        </div>
                                                    </div>

                                                    {/* Center Titles */}
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 text-white z-20">
                                                        <motion.p
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.2 }}
                                                            className="text-2xl font-serif uppercase tracking-widest mb-2"
                                                        >
                                                            {story.title}
                                                        </motion.p>
                                                        <motion.p
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.3 }}
                                                            className="text-lg font-light tracking-wider"
                                                        >
                                                            {story.subtitle}
                                                        </motion.p>
                                                    </div>

                                                    {/* Bottom Product Card */}
                                                    <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 flex items-center gap-3 z-30">
                                                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                                            <img src={story.product.image} alt={story.product.name} className="h-full w-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white text-xs font-medium truncate">{story.product.name}</p>
                                                            <p className="text-white/60 text-[10px]">Shop Now</p>
                                                        </div>
                                                        <button className="p-2 rounded-full bg-white text-charcoal hover:bg-luxury-pink hover:text-white transition-colors">
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Play Button Overlay (Optional hint) */}
                                                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                            <Play className="w-6 h-6 text-white fill-current" />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
