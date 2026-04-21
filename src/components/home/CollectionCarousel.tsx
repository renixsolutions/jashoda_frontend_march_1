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
    bgColor?: string;
}

export default function CollectionCarousel({ 
    collectionSlug, 
    title, 
    subtitle, 
    bgColor = "#fcf8f5" 
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

    if (loading) {
        return (
            <section className="py-24 overflow-hidden flex items-center justify-center min-h-[400px]" style={{ backgroundColor: bgColor }}>
                <Loader2 className="w-8 h-8 animate-spin text-[#832729]" />
            </section>
        );
    }

    if (error || products.length === 0) {
        return null;
    }

    return (
        <section className="py-24 overflow-hidden" style={{ backgroundColor: bgColor }}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-serif text-[#832729] mb-4 italic"
                        >
                            {title}
                        </motion.h2>
                        {subtitle && (
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-[#832729]/70 max-w-md"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={scrollLeft} 
                            className="p-3 rounded-full border border-[#832729]/20 hover:bg-[#832729] hover:text-white text-[#832729] transition-all transform hover:scale-110 active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={scrollRight} 
                            className="p-3 rounded-full border border-[#832729]/20 hover:bg-[#832729] hover:text-white text-[#832729] transition-all transform hover:scale-110 active:scale-95"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide px-4 -mx-4 md:px-0 md:mx-0 mouse-wheel-scroll"
                    style={{ scrollbarWidth: "none" }}
                >
                    <AnimatePresence>
                        {products.map((product, index) => (
                            <motion.div 
                                key={product.id} 
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="snap-center min-w-[280px] md:min-w-[320px]"
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
