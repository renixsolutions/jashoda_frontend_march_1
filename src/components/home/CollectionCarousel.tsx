"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Product } from "@/lib/mockData";

interface CollectionCarouselProps {
    collectionSlug: string;
    title: string;
    subtitle?: string;
    index?: number;
}

export default function CollectionCarousel({ 
    collectionSlug, 
    title, 
    subtitle, 
    index = 0 
}: CollectionCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.getCollectionProducts(collectionSlug);
                setProducts(response.data || []);
                setError(null);
            } catch (err: any) {
                console.error(`Failed to fetch collection ${collectionSlug}:`, err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [collectionSlug]);

    const scrollLeft = () => {
        containerRef.current?.scrollBy({ left: -350, behavior: "smooth" });
    };

    const scrollRight = () => {
        containerRef.current?.scrollBy({ left: 350, behavior: "smooth" });
    };

    const isEven = index % 2 === 0;
    const sectionBg = isEven 
        ? "bg-gradient-to-b from-[#FDF0DF] via-[#FDFBF7] to-[#FCEAEF]" // Mix: Top Gold -> Middle Pearl -> Bottom Rose
        : "bg-gradient-to-b from-[#FCEAEF] via-[#FDFBF7] to-[#FDF0DF]"; // Mix: Top Rose -> Middle Pearl -> Bottom Gold

    if (loading) {
        return (
            <section className={`py-24 overflow-hidden flex items-center justify-center min-h-[400px] ${sectionBg}`}>
                <Loader2 className="w-8 h-8 animate-spin text-[#832729]" />
            </section>
        );
    }

    if (error || products.length === 0) {
        return null;
    }

    return (
        <section className={`py-20 md:py-32 overflow-hidden relative ${sectionBg}`}>
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none" />
            
            {/* Ambient Accent Glow */}
            <div className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} w-[600px] h-[600px] bg-[#C8A165]/10 rounded-full blur-[120px] pointer-events-none`} />

            {/* Massive Luxury Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
                <span className="text-[28vw] font-serif tracking-tighter text-[#C8A165] leading-none whitespace-nowrap drop-shadow-sm">
                    {title.split(' ')[0].toUpperCase()}
                </span>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div className="relative">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-[1px] bg-[#C8A165]/50" />
                            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A165] font-bold">Edition 0{index + 1}</span>
                        </div>
                        <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#09090B] mb-6 tracking-tighter leading-none"
                        >
                            {title.split(' ').map((word, i, arr) => (
                                i === arr.length - 1 ? <span key={i} className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#C8A165] to-[#8C6D3D] font-light pl-2">{word}</span> : word + ' '
                            ))}
                        </motion.h2>
                        {subtitle && (
                            <motion.p 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-[#09090B]/60 max-w-md font-light leading-relaxed tracking-wider text-sm border-l border-[#C8A165]/50 pl-4"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={scrollLeft} 
                            className="p-4 rounded-full border border-[#832729]/10 bg-white shadow-sm hover:bg-[#832729] hover:border-[#832729] hover:text-white text-[#832729] transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        </button>
                        <button 
                            onClick={scrollRight} 
                            className="p-4 rounded-full border border-[#832729]/10 bg-white shadow-sm hover:bg-[#832729] hover:border-[#832729] hover:text-white text-[#832729] transition-all duration-300 group"
                        >
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className="flex gap-8 overflow-x-auto pb-16 pt-4 snap-x snap-mandatory scrollbar-hide px-4 -mx-4 md:px-0 md:mx-0 mouse-wheel-scroll"
                    style={{ scrollbarWidth: "none" }}
                >
                    <AnimatePresence>
                        {products.map((product, idx) => (
                            <motion.div 
                                key={product.id} 
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="snap-center min-w-[280px] md:min-w-[340px]"
                            >
                                <ProductCard product={product} variant="light" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
