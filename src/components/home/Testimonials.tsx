"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const testimonials = [
    {
        id: 1,
        name: "Akanksha Khanna, 27",
        text: "Delighted with my engagement ring from BlueStone! It's my dream ring, fits perfectly and is stunning to look at. Thanks, BlueStone, for helping us find the perfect symbol of love!",
        image: "/customer1.png",
        rotation: -2,
    },
    {
        id: 2,
        name: "Nutan Mishra, 33",
        text: "I got a Nazariya for my baby boy from BlueStone. It's so cute seeing it on my little one's wrist, and it gives me a sense of security knowing it's there. Thanks, BlueStone!",
        image: "/customer1.png",
        rotation: 2,
    },
    {
        id: 3,
        name: "Divya Mishra, 26",
        text: "On Valentine's Day, my husband gifted me a necklace from BlueStone, and I haven't taken it off even once. Everyone asks me where it's from, and I just LOVE how nice it looks on me.",
        image: "/customer1.png",
        rotation: -1,
    },
    {
        id: 4,
        name: "Anuska Ananya, 24",
        text: "BlueStone is my go-to place for jewellery. I love that I can wear their jewellery to work, dates, parties and brunches; it goes with everything and makes my outfits look stylish and trendy.",
        image: "/customer1.png",
        rotation: 3,
    },
];

// Duplicate for infinite scroll
const marqueeItems = [...testimonials, ...testimonials, ...testimonials];

export default function Testimonials() {
    return (
        <section className="py-20 bg-white overflow-hidden ml-1">
            <div className="container mx-auto px-4 mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-serif text-[#1E3A8A] mb-4">
                    Customer Testimonials
                </h2>
            </div>

            <div className="relative w-full">
                {/* Continuous String Line Background - We'll simulate this per-card for easier looping */}

                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex gap-8 px-4"
                        animate={{
                            x: ["0%", "-33.33%"], // We have 3 sets, so moving 1 set width ensures seamless loop
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 30,
                                ease: "linear",
                            },
                        }}
                    >
                        {marqueeItems.map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="relative w-[300px] flex-shrink-0 pt-10 group"
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
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="text-left">
                                        <h3 className="text-[#1E3A8A] font-semibold text-lg leading-tight mb-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-500 text-xs italic leading-relaxed">
                                            "{item.text}"
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
