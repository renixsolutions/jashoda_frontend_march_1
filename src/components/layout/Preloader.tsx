"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading time or wait for window load
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500); // 2.5 seconds for a premium feel

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } 
                    }}
                    className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Logo Animation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ 
                                duration: 1, 
                                ease: "easeOut"
                            }}
                            className="mb-8"
                        >
                            <img
                                src="/jashoda-logo.png"
                                alt="Jashoda Jewels"
                                className="h-24 md:h-32 w-auto object-contain"
                            />
                        </motion.div>

                        {/* Text Animation */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-center"
                        >
                            <h2 className="text-[#702540] font-serif text-xl md:text-2xl tracking-[0.3em] uppercase mb-2">
                                Jashoda Jewels
                            </h2>
                            <div className="flex items-center justify-center gap-4">
                                <motion.div 
                                    className="h-[1px] bg-[#702540]/30 w-12"
                                    initial={{ width: 0 }}
                                    animate={{ width: 48 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                />
                                <span className="text-[#8B5E3C] text-[10px] tracking-[0.5em] uppercase font-light">
                                    Crafting Elegance
                                </span>
                                <motion.div 
                                    className="h-[1px] bg-[#702540]/30 w-12"
                                    initial={{ width: 0 }}
                                    animate={{ width: 48 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                />
                            </div>
                        </motion.div>

                        {/* Progress Bar */}
                        <div className="absolute -bottom-24 w-48 h-[2px] bg-gray-100 overflow-hidden rounded-full">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ 
                                    duration: 2, 
                                    ease: "easeInOut"
                                }}
                                className="w-full h-full bg-[#702540]"
                            />
                        </div>
                    </div>

                    {/* Background Decorative elements */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.03 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle at center, #702540 0%, transparent 70%)"
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
