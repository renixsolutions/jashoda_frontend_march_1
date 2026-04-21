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
        <section className="py-8 bg-white overflow-hidden">
            <div className="container mx-auto px-4 mb-10 text-center">
                <div className="mb-6">
                    <h2 className="text-3xl md:text-5xl font-serif text-[#702540] mb-3 uppercase tracking-[0.2em]">
                        Luxury Collection
                    </h2>
                    <div className="w-32 h-0.5 bg-[#702540] mx-auto opacity-30"></div>
                </div>

                {/* Navigation Buttons - Centered */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={scrollLeft}
                        aria-label="Previous slide"
                        className="w-10 h-10 rounded-full border border-[#702540]/20 flex items-center justify-center text-[#702540] hover:bg-[#702540] hover:text-white transition-all duration-300"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <button
                        onClick={scrollRight}
                        aria-label="Next slide"
                        className="w-10 h-10 rounded-full border border-[#702540]/20 flex items-center justify-center text-[#702540] hover:bg-[#702540] hover:text-white transition-all duration-300"
                    >
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div
                className="w-full overflow-x-auto no-scrollbar scroll-smooth"
                ref={scrollContainerRef}
                style={{ scrollSnapType: "x mandatory" }}
            >
                <div className="flex gap-2 pb-10 w-max px-4 md:px-[5vw]">
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
                            className="block relative w-[92vw] md:w-[75vw] lg:w-[850px] xl:w-[1000px] aspect-[16/9] rounded-xl overflow-hidden shrink-0 snap-center group cursor-pointer"
                        >
                            <Image
                                src={collection.image}
                                alt={`Luxury Collection ${collection.id}`}
                                fill
                                className="object-cover transition-all duration-1000 group-hover:scale-105"
                                priority={collection.id === 1}
                            />
                            
                            {/* Subtle hover effect overlay */}
                            <div className="absolute inset-0 bg-[#702540]/0 group-hover:bg-[#702540]/5 transition-colors duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
