"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const NewArrivals = () => {
    return (
        <section className="relative w-full bg-[#FAFAFA] pb-20">

            {/* Top Banner Section */}
            <div className="relative w-full h-[500px] overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center md:bg-right"
                    style={{ backgroundImage: "url('/gold-rings-banner.png')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B7355]/90 via-[#8B7355]/40 to-transparent md:from-[#8B7355] md:via-[#8B7355]/70 md:to-transparent/0"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center text-white">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 w-fit mb-6"
                    >
                        <Sparkles size={16} className="text-yellow-200" />
                        <span className="text-sm font-medium tracking-wide">500+ New Items</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-5xl md:text-7xl mb-4 text-white drop-shadow-sm"
                    >
                        New Arrivals
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-white/90 max-w-md font-light leading-relaxed mb-8"
                    >
                        New Arrivals Dropping Daily, Monday through Friday. <br className="hidden md:block" />
                        Explore the Latest Launches Now!
                    </motion.p>

                </div>
            </div>

            {/* Overlapping Cards Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Silver Idols Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="group relative h-[350px] md:h-[400px] w-full overflow-hidden rounded-2xl border-[6px] border-white shadow-2xl"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: "url('/silver-idols.png')" }}
                        />
                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                        <div className="absolute bottom-8 left-8">
                            <h3 className="text-3xl font-serif text-white mb-2 transform transition-transform duration-300 group-hover:-translate-y-2">Silver Idols</h3>
                            <span className="inline-flex items-center text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                View Collection <ArrowRight size={16} className="ml-2" />
                            </span>
                        </div>
                    </motion.div>

                    {/* Floral Bloom Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="group relative h-[350px] md:h-[400px] w-full overflow-hidden rounded-2xl border-[6px] border-white shadow-2xl"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: "url('/floral-bloom.png')" }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                        <div className="absolute bottom-8 left-8">
                            <h3 className="text-3xl font-serif text-white mb-2 transform transition-transform duration-300 group-hover:-translate-y-2">Floral Bloom</h3>
                            <span className="inline-flex items-center text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                View Collection <ArrowRight size={16} className="ml-2" />
                            </span>
                        </div>
                    </motion.div>

                </div>
            </div>

        </section>
    );
};

export default NewArrivals;
