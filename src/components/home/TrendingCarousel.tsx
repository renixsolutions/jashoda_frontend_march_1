"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRight, ArrowLeft } from "lucide-react";

// Mock Data
const products = [
    {
        id: "1",
        name: "Ethereal Diamond Ring",
        price: 15999,
        category: "Rings",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2670&auto=format&fit=crop",
        badge: "Best Seller",
        rating: 4.8,
        originalPrice: 19999
    },
    {
        id: "2",
        name: "Moonstone Drop Earrings",
        price: 8499,
        category: "Earrings",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2670&auto=format&fit=crop",
        badge: "Limited Stock",
        rating: 4.5,
        originalPrice: 9999
    },
    {
        id: "3",
        name: "Silver Charm Bracelet",
        price: 12500,
        category: "Bracelets",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2670&auto=format&fit=crop",
        rating: 4.2
    },
    {
        id: "4",
        name: "Rose Gold Pendant",
        price: 9999,
        category: "Necklaces",
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2670&auto=format&fit=crop",
        originalPrice: 12999,
        rating: 4.6
    },
    {
        id: "5",
        name: "Vintage Silver Anklet",
        price: 4500,
        category: "Anklets",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2574&auto=format&fit=crop",
        rating: 4.0
    },
];

export default function TrendingCarousel() {
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        containerRef.current?.scrollBy({ left: -350, behavior: "smooth" });
    };

    const scrollRight = () => {
        containerRef.current?.scrollBy({ left: 350, behavior: "smooth" });
    };

    return (
        <section className="py-24 bg-[#fcf8f5] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-serif text-[#832729] mb-4 italic">Trending Now</h2>
                        <p className="text-[#832729]/70 max-w-md">Our most loved pieces, curated just for you.</p>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={scrollLeft} className="p-3 rounded-full border border-[#832729]/20 hover:bg-[#832729] hover:text-white text-[#832729] transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button onClick={scrollRight} className="p-3 rounded-full border border-[#832729]/20 hover:bg-[#832729] hover:text-white text-[#832729] transition-colors">
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide px-4 -mx-4 md:px-0 md:mx-0"
                    style={{ scrollbarWidth: "none" }}
                >
                    {products.map((product) => (
                        <div key={product.id} className="snap-center min-w-[280px] md:min-w-[320px]">
                            <ProductCard product={product as any} variant="light" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
