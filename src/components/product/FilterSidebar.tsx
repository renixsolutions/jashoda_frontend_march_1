"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface FilterSectionProps {
    title: string;
    options: string[];
}

const FilterSection = ({ title, options }: FilterSectionProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-white/10 py-6 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between text-left mb-4"
            >
                <span className="font-serif text-lg text-white font-medium">{title}</span>
                {isOpen ? <ChevronUp className="h-4 w-4 text-white/70" /> : <ChevronDown className="h-4 w-4 text-white/70" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-3 pb-2">
                            {options.map((option) => (
                                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer h-4 w-4 appearance-none rounded border border-white/30 bg-transparent checked:border-rose-gold checked:bg-rose-gold transition-all"
                                        />
                                        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-charcoal opacity-0 peer-checked:opacity-100">
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">{option}</span>
                                </label>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function FilterSidebar() {
    return (
        <aside className="w-full">
            <div className="glass-dark rounded-3xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 md:hidden">
                    <span className="text-xl font-serif text-white">Filters</span>
                    <button className="text-white/70"><X className="w-6 h-6" /></button>
                </div>

                <FilterSection
                    title="Category"
                    options={["Rings", "Earrings", "Necklaces", "Bracelets", "Anklets", "Sets"]}
                />
                <FilterSection
                    title="Material"
                    options={["Sterling Silver", "Rose Gold Plated", "Gold Plated", "Oxidized Silver"]}
                />
                <FilterSection
                    title="Price Range"
                    options={["Under ₹2,000", "₹2,000 - ₹5,000", "₹5,000 - ₹10,000", "Above ₹10,000"]}
                />
                <FilterSection
                    title="Occasion"
                    options={["Daily Wear", "Office Wear", "Party Wear", "Wedding", "Gifting"]}
                />
            </div>
        </aside>
    );
}
