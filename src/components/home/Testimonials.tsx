"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Star } from "lucide-react";

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await api.getTestimonials(true);
                if (response.success) {
                    setTestimonials(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    if (loading || testimonials.length === 0) return null;

    // Repeat enough times to fill the screen twice even with few testimonials
    const repeatCount = 10;
    const marqueeItems = Array(repeatCount).fill(testimonials).flat();

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A8A] mb-4">
                    Customer Testimonials
                </h2>
            </div>

            <div className="relative w-full">
                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex"
                        animate={{
                            x: ["0%", `-${(1 / repeatCount) * 100}%`],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 3 * (testimonials.length > 0 ? (marqueeItems.length / testimonials.length) : 1),
                                ease: "linear",
                            },
                        }}
                    >
                        {marqueeItems.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="relative w-[360px] flex-shrink-0 pt-10 group px-4"
                            >
                                {/* String Segment */}
                                <svg
                                    className="absolute top-0 left-[-50%] w-[200%] h-[40px] z-10 pointer-events-none"
                                    viewBox="0 0 600 40"
                                    fill="none"
                                    preserveAspectRatio="none"
                                >
                                    {/* A curve that dips in the middle of OUR card (300px mark in this 600px view) */}
                                    {/* M0,10 Q150,10 300,30 Q450,10 600,10 - simplified ease curve */}
                                    <path
                                        d="M0,10 C100,15 200,30 300,30 C400,30 500,15 600,10"
                                        stroke="#D1D5DB"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                </svg>

                                {/* Clip */}
                                <div className="absolute top-[20px] left-1/2 -translate-x-1/2 z-20 w-8 h-10 flex flex-col items-center">
                                    {/* Metal Clip Graphic (CSS/SVG) */}
                                    <div className="w-1 h-4 bg-gray-400 rounded-full mb-[-2px]"></div>
                                    <div className="w-6 h-6 border-2 border-gray-400 rounded-sm bg-transparent shadow-sm rotate-45 transform origin-center"></div>
                                </div>

                                {/* Polaroid Card */}
                                <div
                                    className="bg-white p-4 pb-8 shadow-xl rounded-sm transform transition-transform duration-500 hover:scale-105 hover:z-30 hover:rotate-0"
                                    style={{
                                        transform: `rotate(${item.rotation}deg)`,
                                    }}
                                >
                                    <div className="bg-gray-100 aspect-square mb-4 relative overflow-hidden">
                                        <Image
                                            src={api.getMediaUrl(item.image_url)}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="text-left">
                                        <div className="flex gap-0.5 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                        <h3 className="text-[#1E3A8A] font-semibold text-lg leading-tight mb-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-500 text-xs italic leading-relaxed">
                                            "{item.content}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
