"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, VolumeX, Volume2, MoreVertical, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { api, getMediaUrl } from "@/lib/api";

interface PromoStory {
    id: number;
    title: string;
    subtitle: string;
    video_url: string;
    link_url: string;
    is_active: boolean;
    order_index: number;
}

export default function VideoStories() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [stories, setStories] = useState<PromoStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await api.getStories(true);
                if (res.success && res.data) {
                    setStories(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch stories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    useEffect(() => {
        videoRefs.current.forEach((vid, idx) => {
            if (vid) {
                if (idx === activeIndex) {
                    vid.currentTime = 0;
                    vid.play().catch((e) => console.log('Playback issue:', e));
                } else {
                    vid.pause();
                }
            }
        });
    }, [activeIndex, stories]);

    const nextStory = () => {
        if (stories.length === 0) return;
        setActiveIndex((prev) => (prev + 1) % stories.length);
    };

    const prevStory = () => {
        if (stories.length === 0) return;
        setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
    };

    const getCardStyle = (index: number) => {
        if (stories.length === 0) return {};

        let normalizedDiff = index - activeIndex;
        if (normalizedDiff < -2) normalizedDiff += stories.length;
        if (normalizedDiff > 2) normalizedDiff -= stories.length;

        const isActive = normalizedDiff === 0;
        const isLeft = normalizedDiff < 0;
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

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    if (loading) {
        return (
            <div className="w-full bg-[#131e42]">
                <section className="py-24 relative overflow-hidden flex justify-center items-center min-h-[600px] rounded-t-[60px] md:rounded-t-[100px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#702540] via-[#8a3052] to-[#5c1c33] opacity-90" />
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white relative z-10"></div>
                </section>
            </div>
        );
    }

    if (stories.length === 0) {
        return null;
    }

    return (
        <div className="w-full bg-[#131e42]">
            <section className="py-24 relative overflow-hidden rounded-t-[60px] md:rounded-t-[100px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
                {/* ── Ultra-Premium Background ── */}
                <div className="absolute inset-0 z-0 bg-[#0B0406]" /> 

                {/* Animated Gradient Meshes */}
                <div className="absolute inset-0 z-0 opacity-60 bg-gradient-to-br from-[#702540] via-[#2A0B18] to-[#09090B] bg-[length:200%_200%] animate-gradient-xy" />

                {/* Floating Ambient Glows */}
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[70%] bg-[radial-gradient(circle,rgba(200,161,101,0.15)_0%,transparent_70%)] pointer-events-none blur-[50px]" 
                />
                <motion.div 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} 
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[80%] bg-[radial-gradient(circle,rgba(112,37,64,0.3)_0%,transparent_70%)] pointer-events-none blur-[60px]" 
                />

                {/* Luxury Typography Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
                    <span className="text-[28vw] font-serif tracking-tighter text-white leading-none whitespace-nowrap">
                        STORIES
                    </span>
                </div>

                {/* Sophisticated Texture */}
                <div className="absolute top-0 left-0 w-full h-full z-0 opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-screen pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10 pt-10">
                    
                    {/* Refined Header */}
                    <div className="text-center mb-20 px-4 relative z-20">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center justify-center gap-4 mb-6"
                        >
                            <div className="w-12 h-[1px] bg-[#C8A165]/40" />
                            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A165] font-bold">The Editorial</span>
                            <div className="w-12 h-[1px] bg-[#C8A165]/40" />
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-8 tracking-tight"
                        >
                            Stories & <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#F2D7A1] to-[#C8A165]">Styles</span>
                        </motion.h2>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-white/50 text-xs md:text-sm tracking-widest uppercase font-light max-w-lg mx-auto leading-relaxed"
                        >
                            A curated exhibition of our finest moments in motion.
                        </motion.p>
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
                        {stories.map((story, index) => {
                            const style = getCardStyle(index);
                            const isActive = index === activeIndex;

                            return (
                                <motion.div
                                    key={story.id || index}
                                    className={cn(
                                        "absolute w-[300px] md:w-[350px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-charcoal border border-white/10",
                                        isActive ? "cursor-default" : "cursor-pointer"
                                    )}
                                    initial={false}
                                    animate={style}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    onClick={() => !isActive && setActiveIndex(index)}
                                    style={{
                                        transformStyle: "preserve-3d",
                                    }}
                                >
                                    {/* Story Content (Only fully visible if active) */}
                                    <div className="relative h-full w-full">
                                        {story.video_url ? (
                                            <video
                                                ref={(el) => {
                                                    videoRefs.current[index] = el;
                                                }}
                                                src={getMediaUrl(story.video_url)}
                                                className="h-full w-full object-cover"
                                                muted={isMuted}
                                                playsInline
                                                onEnded={nextStory}
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-gray-800 flex items-center justify-center text-white/50">
                                                No Media
                                            </div>
                                        )}

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
                                                            <button onClick={toggleMute} className="text-white hover:text-white/80 transition-colors">
                                                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                                            </button>
                                                            <MoreVertical className="w-5 h-5" />
                                                        </div>
                                                    </div>

                                                    {/* Center Titles */}
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 text-white z-20 pointer-events-none">
                                                        <motion.p
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.2 }}
                                                            className="text-2xl font-serif uppercase tracking-widest mb-2 drop-shadow-lg"
                                                        >
                                                            {story.title}
                                                        </motion.p>
                                                        <motion.p
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.3 }}
                                                            className="text-lg font-light tracking-wider drop-shadow-md"
                                                        >
                                                            {story.subtitle}
                                                        </motion.p>
                                                    </div>

                                                    {/* Bottom Link Card */}
                                                    {story.link_url && (
                                                        <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 flex items-center justify-between z-30">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-white text-sm font-medium">Explore Now</p>
                                                            </div>
                                                            <Link href={story.link_url} className="p-2 rounded-full bg-white text-charcoal hover:bg-luxury-pink hover:text-white transition-colors">
                                                                <ArrowRight className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    )}
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
        </div>
    );
}

