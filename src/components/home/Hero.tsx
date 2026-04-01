"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function Hero() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-transparent flex items-center justify-center pt-24 pb-12 px-6 md:px-12">

            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-start gap-6 text-left z-10"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-[1px] w-12 bg-white/60"></span>
                            <span className="text-sm font-medium tracking-[0.2em] text-white/80 uppercase">
                                Jashoda Jewels
                            </span>
                            <span className="h-[1px] w-12 bg-white/60"></span>
                        </div>
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-tight italic">
                            {/* Timeless Elegance In Pure Silver <br /> */}
                            <span className="not-italic font-normal">Timeless Elegance
In Pure Silver</span>
                        </h1>
                    </div>

                    <p className="text-lg text-white/80 max-w-md font-light leading-relaxed">
                        Discover our curated collection of 925 and 999 sterling silver jewelry and exquisitely crafted idols.
                    </p>

                    <Button
                        size="lg"
                        className="bg-rose-gold text-charcoal hover:bg-white hover:text-deep-rose rounded-full px-8 py-6 text-lg font-serif shadow-xl transition-all duration-300 mt-4 tracking-wider"
                    >
                        Shop Now
                    </Button>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="relative flex justify-center items-center z-10"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-white/20 blur-[100px] rounded-full transform scale-75" />

                    <img
                        src="/sil1.png"
                        alt="Elegant Diamond Ring"
                        className="relative w-full max-w-[500px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                        style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))" }}
                    />
                </motion.div>
            </div>

            {/* Decorative Elements */}
            {/* Decorative Elements with Parallax */}
            <motion.div
                style={{ y: useTransform(useScroll().scrollY, [0, 1000], [0, 300]) }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-soft-rose/30 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
            />
            <motion.div
                style={{ y: useTransform(useScroll().scrollY, [0, 1000], [0, -200]) }}
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-deep-rose/40 to-transparent rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"
            />

        </div>
    );
}
