"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

const ServiceMarquee = () => {
    const [marqueeData, setMarqueeData] = useState<{
        messages: { id: number, text: string }[],
        settings: { speed: number, bg_color: string, text_color: string, is_active: boolean }
    } | null>(null);

    useEffect(() => {
        const fetchMarquee = async () => {
            try {
                const res = await api.getMarquee();
                if (res.success) {
                    setMarqueeData(res.data);
                }
            } catch (error) {
                console.error("Error fetching marquee:", error);
            }
        };
        fetchMarquee();
    }, []);

    if (marqueeData && (!marqueeData.settings.is_active || marqueeData.messages.length === 0)) {
        return null;
    }

    const defaultMessages = [
        "Free shipping on orders above ₹50,000",
        "100% certified jewellery",
        "Lifetime exchange & buyback",
        "Secure & insured delivery"
    ];


    const messages = marqueeData?.messages.map(m => m.text) || defaultMessages;

    return (
        <section className="relative w-full overflow-hidden py-3 md:py-4 z-20 border-y border-white/5 bg-[#09090B]">
            {/* ── Ambient Background Layer ── */}
            <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(200,161,101,0.03)_0%,transparent_70%)]" />

            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    ease: "linear",
                    duration: marqueeData?.settings.speed || 40,
                    repeat: Infinity
                }}
                className="relative z-20 flex whitespace-nowrap items-center w-max group cursor-default"
            >
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-20 md:gap-40 px-10 md:px-20 items-center">
                        {messages.map((text, idx) => (
                            <div key={idx} className="flex items-center gap-20 md:gap-40">
                                <span className="text-[11px] md:text-[13px] tracking-[0.2em] md:tracking-[0.3em] font-semibold text-[#F2D7A1] hover:text-white transition-all duration-700">
                                    {text}
                                </span>

                                {/* ── Elegant Gold/Silver Separator ── */}
                                <div className="relative">
                                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-[#C8A165]/40 rotate-45 border border-[#C8A165]/20" />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </motion.div>
        </section>
    );
};

export default ServiceMarquee;
