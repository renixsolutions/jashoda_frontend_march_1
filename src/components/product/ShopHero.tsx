"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { Category } from "@/lib/mockData";
import Image from "next/image";
import { useNavigation } from "@/contexts/NavigationContext";

const PRICERANGES = [
    { label: "Under ₹10k", min: 0, max: 10000 },
    { label: "₹10k - ₹25k", min: 10000, max: 25000 },
    { label: "₹25k - ₹50k", min: 25000, max: 50000 },
    { label: "Above ₹50k", min: 50000, max: 1000000 },
];

export default function ShopHero() {
    const { genders, occasions, categories: allParentCategories } = useNavigation();
    const [activeTab, setActiveTab] = useState("Category");
    const [promos, setPromos] = useState<any[]>([]);
    const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

    useEffect(() => {
        const fetchPromos = async () => {
            const res = await api.getPromos(true).catch(() => null);
            if (res?.data) setPromos(res.data);
        };
        fetchPromos();
    }, []);

    const currentPromo = promos.length > 0 ? promos[currentPromoIndex] : null;

    const getPromoVideoUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const apiDomain = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:3000';
        return `${apiDomain}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const tabs = ["Category", "Price", "Occasion", "Gender"];

    return (
        <section className="w-full bg-white overflow-hidden border-b border-gray-100">
            <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-220px)] min-h-[500px]">
                {/* Left Sidebar */}
                <div className="w-full md:w-64 bg-[#FBFBFB] border-r border-gray-100 py-6 overflow-y-auto">
                    <div className="flex flex-row md:flex-col gap-1 px-3 overflow-x-auto md:overflow-x-visible no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "whitespace-nowrap md:whitespace-normal text-left px-5 py-3.5 text-sm font-medium transition-all duration-300 rounded-xl flex items-center justify-between group min-w-fit md:min-w-0",
                                    activeTab === tab
                                        ? "text-[#111827] bg-white shadow-sm ring-1 ring-gray-100 font-bold"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <div className={cn(
                                        "hidden md:block w-1.5 h-1.5 rounded-full transition-all duration-300",
                                        activeTab === tab ? "bg-[#111827] scale-125" : "bg-transparent group-hover:bg-gray-300"
                                    )} />
                                    {tab}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center Content */}
                <div className="flex-1 p-6 md:p-10 bg-white overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "Category" && (
                                <div>
                                    <div className="flex items-center gap-2 mb-8">
                                        <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                                        <h3 className="text-xl font-bold text-[#1E2856] uppercase tracking-widest">Discover Collections</h3>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                        {allParentCategories.map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/shop?category=${cat.slug}`}
                                                className="flex flex-col items-center gap-4 group text-center"
                                            >
                                                <div className="w-20 h-20 md:w-24 md:h-24 relative bg-white rounded-2xl p-2 border border-gray-100 shadow-sm group-hover:shadow-md transition-all overflow-hidden transform group-hover:-translate-y-1">
                                                    {(cat.image_url || cat.image) ? (
                                                        <Image
                                                            src={(cat.image_url || cat.image) as string}
                                                            alt={cat.name}
                                                            fill
                                                            className="object-contain p-2 group-hover:scale-110 transition-transform"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <Image src="/diamond-pendant.png" alt={cat.name} fill className="object-contain p-2" />
                                                    )}
                                                </div>
                                                <span className="text-xs md:text-sm font-semibold text-[#1E2856] group-hover:text-[#111827] transition-colors">{cat.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "Price" && (
                                <div>
                                    <h3 className="text-xl font-bold text-[#1E2856] uppercase tracking-widest mb-8">Shop by Price</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                        {PRICERANGES.map((range) => (
                                            <Link
                                                key={range.label}
                                                href={`/shop?min=${range.min}&max=${range.max}`}
                                                className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-[#111827]/30 hover:bg-rose-50/20 transition-all group"
                                            >
                                                <span className="text-[#1E2856] font-bold group-hover:text-[#111827]">{range.label}</span>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#111827]" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional tabs like Occasion and Gender can be implemented similarly */}
                            {(activeTab === "Occasion" || activeTab === "Gender") && (
                                <div className="py-20 text-center text-gray-400">
                                    <p>Browse our curated collections for various {activeTab.toLowerCase()}s by clicking below.</p>
                                    <Link href="/shop" className="mt-4 inline-block text-[#111827] font-bold hover:underline">View All</Link>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Promo (Reel) */}
                <div className="hidden lg:flex w-[400px] xl:w-[500px] h-full relative bg-black flex-shrink-0">
                    {currentPromo ? (
                        <div className="w-full h-full relative">
                            <video
                                src={getPromoVideoUrl(currentPromo.video_url)}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                playsInline
                                loop
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-10 left-10 text-white">
                                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">Featured</span>
                                <h4 className="text-3xl font-serif italic mb-4">{currentPromo.title || "Elite Collection"}</h4>
                                <Link href={currentPromo.link_url || "/shop"} className="inline-flex items-center gap-2 bg-white text-black py-3 px-8 rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-[#111827] hover:text-white transition-all">
                                    Explore <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                            <Sparkles size={48} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
