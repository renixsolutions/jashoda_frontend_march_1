"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock IDs for products to avoid errors
const p1 = "p1", p2 = "p2", p3 = "p3", p4 = "p4", p5 = "p5", p6 = "p6", p7 = "p7", p8 = "p8", p9 = "p9";

const collections = [
    {
        id: 1,
        // title: "Eternal Bloom",
        // subtitle: "Valentine's Collection",
        // description: "Our Valentine's Day silver jewellery, crafted with ice-cut stones",
        image: "/card2.png", // Changed to card1
        theme: "pink", // Light theme
        // products: [
        //     { id: p1, image: "/luxury-product-thumb.png" },
        //     { id: p2, image: "/luxury-product-thumb.png" },
        //     { id: p3, image: "/luxury-product-thumb.png" },
        // ],
    },
    {
        id: 2,
        // title: "Glow in Motion",
        // subtitle: "New Collection",
        // description: "Experience the shimmer of movement with our kinetic designs",
        image: "/card1.png", // Changed to card2
        theme: "dark", // Dark theme
        // products: [
        //     { id: p4, image: "/luxury-product-thumb.png" },
        //     { id: p5, image: "/luxury-product-thumb.png" },
        //     { id: p6, image: "/luxury-product-thumb.png" },
        // ],
    },
    {
        id: 3,
        // title: "Royal Heritage",
        // subtitle: "Wedding Edition",
        // description: "Timeless pieces for your most special moments",
        image: "/card3.png", // Changed to card3
        theme: "gold",
        // products: [
        //     { id: p7, image: "/luxury-product-thumb.png" },
        //     { id: p8, image: "/luxury-product-thumb.png" },
        //     { id: p9, image: "/luxury-product-thumb.png" },
        // ],
    },
];

// Mock IDs for products to avoid errors


export default function LuxuryShowcase() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -window.innerWidth * 0.8, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: window.innerWidth * 0.8, behavior: "smooth" });
        }
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 mb-8 relative flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl md:text-5xl font-serif text-[#702540] mb-2">
                        Luxury Collections
                    </h2>
                    <p className="text-gray-500 font-sans">Curated specifically for you</p>
                </div>

                {/* Navigation Buttons */}
                <div className="absolute right-4 bottom-0 flex gap-4">
                    <button
                        onClick={scrollLeft}
                        className="w-12 h-12 rounded-full border border-[#702540] flex items-center justify-center text-[#702540] hover:bg-[#702540] hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="w-12 h-12 rounded-full border border-[#702540] flex items-center justify-center text-[#702540] hover:bg-[#702540] hover:text-white transition-colors"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div
                className="w-full overflow-x-auto no-scrollbar pl-4 md:pl-[max(1rem,calc((100vw-1200px)/2))]"
                ref={scrollContainerRef}
                style={{ scrollSnapType: "x mandatory" }}
            >
                <div className="flex gap-8 pb-12 w-max pr-4">
                    {collections.map((collection) => (
                        <div
                            key={collection.id}
                            className="relative w-[85vw] md:w-[900px] h-[500px] rounded-3xl overflow-hidden shrink-0 snap-center shadow-2xl group"
                        >
                            {/* Background Image */}
                            <Image
                                src={collection.image}
                                alt={collection.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Gradient Overlay for Text Readability */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${collection.theme === 'dark' ? 'from-black/80 via-black/20 to-transparent' : 'from-pink-900/40 via-transparent to-transparent'}`}></div>

                            {/* Content */}
                            <div className="absolute top-0 left-0 w-full h-full p-8 md:p-12 flex flex-col justify-center items-start text-white max-w-lg">
                                <span className="uppercase tracking-[0.2em] text-sm mb-4 border-b border-white/50 pb-2">
                                    {collection.subtitle}
                                </span>
                                <h3 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
                                    {collection.title}
                                </h3>
                                <p className="text-lg md:text-xl font-light opacity-90 mb-8">
                                    {collection.description}
                                </p>
                                {/* <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all uppercase tracking-wide text-sm">
                                    Explore Collection
                                </button> */}
                            </div>

                            {/* Product Overlay Cards - Floating at bottom */}
                            {/* <div className="absolute bottom-8 right-8 flex gap-4">
                                {collection.products.map((product, idx) => (
                                    <Link href={`/product/${product.id}`} key={idx}>
                                        <motion.div
                                            className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl shadow-lg p-2 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + idx * 0.1 }}
                                        >
                                            <div className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden">
                                                <Image
                                                    src={product.image}
                                                    alt="Product"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div> */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
