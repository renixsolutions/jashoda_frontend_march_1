"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Option {
    label: string;
    value: string;
}

interface FilterDropdownProps {
    label: string;
    options: Option[];
    selectedValue?: string;
    onApply: (value: string) => void;
    onClear?: () => void;
    active?: boolean;
}

export default function FilterDropdown({
    label,
    options,
    selectedValue,
    onApply,
    onClear,
    active
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempValue, setTempValue] = useState(selectedValue || "");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTempValue(selectedValue || "");
    }, [selectedValue, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleApply = () => {
        onApply(tempValue);
        setIsOpen(false);
    };

    const selectedOption = options.find(o => o.value === selectedValue);
    const displayLabel = active && selectedOption ? selectedOption.label : label;

    return (
        <div className="relative" ref={dropdownRef}>
            <div className={cn(
                "flex items-center gap-2 rounded-full border transition-all shrink-0 h-10 overflow-hidden shadow-sm",
                active
                    ? "bg-rose-50 border-[#702540] text-[#702540]"
                    : "bg-white border-[#E0E0E0] text-[#404040] hover:border-[#702540]"
            )}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 pl-6 pr-4 h-full text-[11px] font-bold uppercase tracking-widest hover:text-[#702540] transition-colors"
                >
                    <span className="max-w-[120px] truncate">{displayLabel}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isOpen && "rotate-180")} />
                </button>

                {active && onClear && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClear();
                        }}
                        className="h-full px-3 border-l border-[#702540]/20 flex items-center justify-center hover:bg-[#702540] hover:text-white transition-all group"
                        title="Clear filter"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                        <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                            <div className="space-y-1">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setTempValue(option.value)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all text-left",
                                            tempValue === option.value
                                                ? "bg-rose-50 text-[#702540] font-bold"
                                                : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        {option.label}
                                        {tempValue === option.value && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-[#FBFBFB] flex gap-2">
                            <button
                                onClick={handleApply}
                                className="flex-1 bg-[#702540] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#5a1d33] transition-colors shadow-lg active:scale-95"
                            >
                                Apply Filter
                            </button>
                            {tempValue && (
                                <button
                                    onClick={() => { setTempValue(""); onApply(""); setIsOpen(false); }}
                                    className="px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
