"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { Product } from "@/lib/mockData";

export default function PDPTabs({ product }: { product: Product }) {
    const [openSection, setOpenSection] = useState<string | null>("delivery");
    const [pincode, setPincode] = useState("");

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="mt-8 border-t border-gray-200 select-none">
            {/* Switched Section: Delivery Availability sits here below Available Offers */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection("delivery")}
                    className="w-full py-4 flex justify-between items-center text-left cursor-pointer"
                >
                    <span className="text-xs font-serif font-bold tracking-widest text-[#31111B] uppercase flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Delivery Availability
                    </span>
                    {openSection === "delivery" ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {openSection === "delivery" && (
                    <div className="pb-6 pt-1 transition-all">
                        <p className="text-xs text-gray-500 mb-3 font-sans leading-relaxed">
                            Enter your pincode to verify fast express shipping eligibility and secure delivery timelines to your specific location.
                        </p>
                        <div className="flex gap-2 max-w-md">
                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#31111B] font-sans transition-colors"
                            />
                            <button className="px-6 py-2.5 rounded-xl bg-[#31111B] text-[#D4AF37] text-xs font-bold tracking-widest hover:bg-[#4a1825] transition-all uppercase cursor-pointer shadow-xs shrink-0">
                                Check
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Shipping Section */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection("shipping")}
                    className="w-full py-4 flex justify-between items-center text-left cursor-pointer"
                >
                    <span className="text-xs font-serif font-bold tracking-widest text-[#31111B] uppercase">
                        Shipping & Returns
                    </span>
                    {openSection === "shipping" ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {openSection === "shipping" && (
                    <div className="pb-6 text-xs text-gray-600 font-sans leading-relaxed">
                        <p>
                            Enjoy fully insured, express shipping on all handcrafted masterpieces. Returns and hassle-free exchanges are welcomed within 30 days of standard delivery receipt.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
