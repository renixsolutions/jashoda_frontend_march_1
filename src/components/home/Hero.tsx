"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Hero() {
    const [banner, setBanner] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Hooks must be called at the top level, before any early returns
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

    useEffect(() => {
        const fetchMainHero = async () => {
            try {
                const response = await api.getBanners(true, 'MAIN_HERO');
                if (response.success && response.data.length > 0) {
                    setBanner(response.data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch main hero", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMainHero();
    }, []);

    const handleBannerClick = () => {
        if (!banner) return;
        const queryParams = new URLSearchParams();
        if (banner.category_id) queryParams.append("category", String(banner.category_id));
        if (banner.subcategory_id) queryParams.append("subcategory", String(banner.subcategory_id));
        if (banner.gender_id) queryParams.append("gender", String(banner.gender_id));
        if (banner.occasion_id) queryParams.append("occasion", String(banner.occasion_id));

        const queryString = queryParams.toString();
        router.push(`/shop${queryString ? `?${queryString}` : ""}`);
    };

    if (loading) return <div className="min-h-screen bg-transparent"></div>;

    // Default static data if no banner found
    const displayData = banner || {
        brand_text: "Jashoda Jewels",
        title: "Timeless Elegance\nIn Pure Silver",
        description: "Discover our curated collection of 925 and 999 sterling silver jewelry and exquisitely crafted idols.",
        image_url: "/sil1.png",
        cta_text: "Shop Now",
        accent_color: "text-white"
    };

    return (
        <div className={`relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-24 pb-12 px-6 md:px-12 ${banner?.bg_color || 'bg-transparent'}`}>

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
                                {displayData.brand_text}
                            </span>
                            <span className="h-[1px] w-12 bg-white/60"></span>
                        </div>
                        <h1 className={`font-serif text-5xl md:text-7xl lg:text-8xl ${displayData.accent_color || 'text-white'} font-bold leading-tight italic`}>
                            <span className="not-italic font-normal whitespace-pre-line">{displayData.title}</span>
                        </h1>
                    </div>

                    <p className="text-lg text-white/80 max-w-md font-light leading-relaxed">
                        {displayData.description}
                    </p>

                    <Button
                        onClick={handleBannerClick}
                        size="lg"
                        className="bg-rose-gold text-charcoal hover:bg-white hover:text-deep-rose rounded-full px-8 py-6 text-lg font-serif shadow-xl transition-all duration-300 mt-4 tracking-wider"
                    >
                        {displayData.cta_text || 'Shop Now'}
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
                        src={api.getMediaUrl(displayData.image_url)}
                        alt={displayData.title}
                        className="relative w-full max-w-[500px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                        style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))" }}
                    />
                </motion.div>
            </div>

            {/* Decorative Elements with Parallax */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-soft-rose/30 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
            />
            <motion.div
                style={{ y: y2 }}
                className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-deep-rose/40 to-transparent rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"
            />

        </div>
    );
}
