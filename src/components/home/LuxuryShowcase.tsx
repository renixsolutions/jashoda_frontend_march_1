"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

// Mock IDs for products to avoid errors
const p1 = "p1", p2 = "p2", p3 = "p3", p4 = "p4", p5 = "p5", p6 = "p6", p7 = "p7", p8 = "p8", p9 = "p9";

const collections = [
    {
        id: 1,
        image: "/card1.png",
        link: "/shop?category=silver",
    },
    {
        id: 2,
        image: "/card2.png",
        link: "/shop?category=silver",
    },
    {
        id: 3,
        image: "/card3.png",
        link: "/shop?category=jewellery",
    },
];

export default function LuxuryShowcase() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated, promptLogin } = useAuth();
    const router = useRouter();

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
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 mb-12 relative flex items-center justify-between">
                <div>
                    <h2 className="text-3xl md:text-5xl font-serif text-[#702540] mb-2 uppercase tracking-wide">
                        Luxury Collections
                    </h2>
                    <div className="w-24 h-1 bg-[#702540]/20 rounded-full"></div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={scrollLeft}
                        aria-label="Previous slide"
                        className="w-12 h-12 rounded-full border border-[#702540]/30 flex items-center justify-center text-[#702540] hover:bg-[#702540] hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onClick={scrollRight}
                        aria-label="Next slide"
                        className="w-12 h-12 rounded-full border border-[#702540]/30 flex items-center justify-center text-[#702540] hover:bg-[#702540] hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div
                className="w-full overflow-x-auto no-scrollbar"
                ref={scrollContainerRef}
                style={{ scrollSnapType: "x mandatory" }}
            >
                <div className="flex gap-6 pb-12 w-max px-4 md:px-[max(1rem,calc((100vw-1200px)/2))]">
                    {collections.map((collection) => (
                        <div
                            key={collection.id}
                            onClick={() => {
                                if (isAuthenticated) {
                                    router.push(collection.link);
                                } else {
                                    promptLogin();
                                }
                            }}
                            className="block relative w-[85vw] md:w-[900px] aspect-[16/9] md:h-[500px] rounded-[2rem] overflow-hidden shrink-0 snap-center shadow-xl group cursor-pointer"
                        >
                            <Image
                                src={collection.image}
                                alt={`Luxury Collection ${collection.id}`}
                                fill
                                className="object-cover transition-all duration-1000 group-hover:scale-105"
                                priority={collection.id === 1}
                            />
                            
                            {/* Subtle hover effect overlay */}
                            <div className="absolute inset-0 bg-[#702540]/0 group-hover:bg-[#702540]/10 transition-colors duration-500"></div>
                            
                            {/* Visual highlight on hover */}
                            <motion.div 
                                className="absolute bottom-0 left-0 w-full h-1 bg-[#702540]"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
