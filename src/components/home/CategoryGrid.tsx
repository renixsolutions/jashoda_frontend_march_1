"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Defines the categories to be displayed in the grid.
 * We are using placeholder images generated or existing in the project.
 * For a real app, these would be fetched from a CMS or API.
 */
const categories = [
    {
        id: 1,
        name: "EARRINGS",
        image: "/floral-bloom.png",
        href: "/shop/earrings",
    },
    {
        id: 2,
        name: "FINGER RINGS",
        image: "/gold-rings-banner.png",
        href: "/shop/rings",
    },
    {
        id: 3,
        name: "PENDANTS",
        image: "/diamond-pendant.png",
        href: "/shop/pendants",
    },
    {
        id: 4,
        name: "MANGALSUTRA",
        image: "/mangalsutra.png",
        href: "/shop/mangalsutra",
    },
    {
        id: 5,
        name: "BRACELETS",
        image: "/gold-chain.png", // Using chain as placeholder for bracelets if needed, or better, reuse loop
        href: "/shop/bracelets",
    },
    {
        id: 6,
        name: "BANGLES",
        image: "/diamond-bangle.png",
        href: "/shop/bangles",
    },
    {
        id: 7,
        name: "CHAINS",
        image: "/gold-chain.png",
        href: "/shop/chains",
    },
];

export default function CategoryGrid() {
    return (
        <section className="py-24 px-4 md:px-8 bg-white" id="shop-categories">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1E1E1E] leading-tight"
                    >
                        Find Your Perfect Match
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-[#8B5E3C] uppercase tracking-[0.2em] text-sm font-medium"
                    >
                        Shop by Categories
                    </motion.p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {categories.map((category, index) => (
                        <div key={category.id} className="flex flex-col items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative w-full aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                            >
                                <Link href={category.href}>
                                    {/* Image with zoom effect */}
                                    <div className="absolute inset-0 bg-gray-100">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out"
                                        />
                                    </div>

                                    {/* Subtle Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                </Link>
                            </motion.div>

                            {/* Category Name Below Card */}
                            <Link href={category.href}>
                                <h3 className="mt-6 text-[#1E1E1E] font-serif text-sm md:text-base font-semibold uppercase tracking-widest hover:text-[#C8A165] transition-colors duration-300">
                                    {category.name}
                                </h3>
                            </Link>
                        </div>
                    ))}

                    {/* "View All" Special Card */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }} // Last item delay
                            viewport={{ once: true }}
                            className="group relative w-full aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white border border-gray-100 flex flex-col justify-center items-center text-center p-6"
                        >
                            <Link href="/shop" className="w-full h-full flex flex-col justify-center items-center">
                                <span className="font-serif text-6xl text-[#702540] mb-2 font-medium">10+</span>
                                <span className="text-gray-500 text-xs uppercase tracking-wide font-medium max-w-[120px] leading-relaxed">
                                    Categories to choose from
                                </span>

                                {/* Arrow Icon Circle */}
                                <div className="mt-8 w-12 h-12 rounded-full border border-[#702540]/30 flex items-center justify-center text-[#702540] group-hover:bg-[#702540] group-hover:text-white group-hover:border-transparent transition-all duration-500">
                                    <ArrowRight size={20} strokeWidth={1.5} />
                                </div>
                            </Link>
                        </motion.div>

                        <Link href="/shop">
                            <h3 className="mt-6 text-[#1E1E1E] font-serif text-sm md:text-base font-semibold uppercase tracking-widest hover:text-[#C8A165] transition-colors duration-300">
                                VIEW ALL
                            </h3>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
