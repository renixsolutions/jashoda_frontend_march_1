"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [sparkles, setSparkles] = useState<Array<{ id: number; size: number; left: string; top: string; delay: number; duration: number }>>([]);

    useEffect(() => {
        // Generate sparkles on client-side to prevent SSR hydration mismatch
        setSparkles(
            [...Array(40)].map((_, i) => ({
                id: i,
                size: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                delay: Math.random() * 2,
                duration: Math.random() * 2 + 1
            }))
        );

        const timer = setTimeout(() => {
            setLoading(false);
        }, 4000); 

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {loading && (
                <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
                    {/* ── Vertical Split Curtain Exit ── */}
                    <motion.div
                        initial={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                        className="absolute inset-0 h-1/2 bg-[#09090B] z-50 border-b border-white/5"
                    />
                    <motion.div
                        initial={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#09090B] z-50 border-t border-white/5"
                    />

                    {/* ── Central Masterpiece ── */}
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-[#09090B] pointer-events-auto"
                    >
                        {/* 1. Full-Screen "Shinny" Sparkles */}
                        <div className="absolute inset-0 z-0">
                            {sparkles.map((sparkle) => (
                                <motion.div
                                    key={sparkle.id}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ 
                                        opacity: [0, 1, 0], 
                                        scale: [0, 1, 0],
                                        y: [0, -20]
                                    }}
                                    transition={{
                                        duration: sparkle.duration,
                                        delay: sparkle.delay,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute bg-[#C8A165] rounded-full shadow-[0_0_10px_2px_#C8A165]"
                                    style={{
                                        width: sparkle.size,
                                        height: sparkle.size,
                                        left: sparkle.left,
                                        top: sparkle.top,
                                    }}
                                />
                            ))}
                        </div>

                        {/* 2. Full-Screen Sweeping Light Ray */}
                        <motion.div 
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: "100%", opacity: [0, 0.2, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[#C8A165]/20 to-transparent skew-x-[-20deg]"
                        />

                        {/* 3. The Initial Spark */}
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="absolute z-10 w-2 h-2 bg-[#C8A165] rounded-full shadow-[0_0_40px_10px_#C8A165]"
                        />

                        <div className="relative z-10 flex flex-col items-center max-w-[90vw]">
                            {/* 4. The Main Logo with Mask Wipe */}
                            <motion.div
                                initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                                animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                                transition={{ duration: 1.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="relative mb-0"
                            >
                                <img
                                    src="/preloader.png"
                                    alt="Jashoda Jewels"
                                    className="h-32 md:h-60 w-auto object-contain drop-shadow-[0_0_60px_rgba(200,161,101,0.2)]"
                                />
                            </motion.div>

                            {/* 5. Subtitle */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2.2, duration: 1 }}
                                className="flex flex-col items-center mt-8"
                            >
                                <div className="h-[1px] w-20 bg-[#C8A165]/30 mb-6" />
                                <span className="text-[#C8A165] text-[10px] md:text-[12px] tracking-[0.8em] font-light uppercase italic">
                                    Crafting eternal legacy
                                </span>
                            </motion.div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}







