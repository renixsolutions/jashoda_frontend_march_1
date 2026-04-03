"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden">
            <div className="relative flex flex-col items-center scale-90 md:scale-100">
                {/* Logo Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                        duration: 0.8, 
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
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-center"
                >
                    <h2 className="text-[#702540] font-serif text-xl md:text-2xl tracking-[0.3em] uppercase mb-2">
                        Jashoda Jewels
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] bg-[#702540]/20 w-8" />
                        <span className="text-[#8B5E3C] text-[10px] tracking-[0.5em] uppercase font-light animate-pulse">
                            Curating Elegance
                        </span>
                        <div className="h-[1px] bg-[#702540]/20 w-8" />
                    </div>
                </motion.div>

                {/* Elegant Spinner Overlay */}
                <div className="absolute inset-0 -m-8 pointer-events-none">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full border border-dashed border-[#702540]/5 rounded-full"
                    />
                </div>
            </div>

            {/* Subtle Progress Bar at extreme bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-50 overflow-hidden">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-full h-full bg-gradient-to-r from-transparent via-[#702540] to-transparent"
                />
            </div>
            
            {/* Background Decorative element */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: "radial-gradient(circle at center, #702540 0%, transparent 70%)"
                }}
            />
        </div>
    );
}
