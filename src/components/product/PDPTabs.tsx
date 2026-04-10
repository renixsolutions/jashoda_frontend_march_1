"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Product } from "@/lib/mockData";

import ReviewSection from "./ReviewSection";

export default function PDPTabs({ product }: { product: Product }) {
    const [openSection, setOpenSection] = useState<string | null>("description");

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="mt-8 border-t border-gray-200">
            {/* Description Section */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection("description")}
                    className="w-full py-4 flex justify-between items-center text-left"
                >
                    <span className="text-xs font-bold tracking-wider text-[#1E2856] uppercase">Product Description</span>
                    {openSection === "description" ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {openSection === "description" && (
                    <div className="pb-6 text-sm text-gray-600 space-y-4">
                        <p>
                            {product.description || `Handcrafted with precision for a timeless piece of elegance.`}
                        </p>
                        <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                            <li>
                                <span className="font-medium text-gray-800">Metal:</span> {product.purity ? `${product.purity} ` : ''}{product.metal_type || product.metalType || 'Silver'}
                            </li>
                            {product.metal_weight && (
                                <li>
                                    <span className="font-medium text-gray-800">Metal Weight:</span> {product.metal_weight}g
                                </li>
                            )}
                            {(product.category_name || product.category) && (
                                <li>
                                    <span className="font-medium text-gray-800">Category:</span> {product.category_name || product.category}
                                </li>
                            )}
                            {(product.stone_type || product.stoneType) && (
                                <li>
                                    <span className="font-medium text-gray-800">Stone Type:</span> {product.stone_type || product.stoneType}
                                </li>
                            )}
                            {product.stone_weight && (
                                <li>
                                    <span className="font-medium text-gray-800">Stone Weight:</span> {product.stone_weight} Carat
                                </li>
                            )}
                            {product.stone_count && (
                                <li>
                                    <span className="font-medium text-gray-800">Stone Count:</span> {product.stone_count}
                                </li>
                            )}
                            {product.certification && (
                                <li>
                                    <span className="font-medium text-gray-800">Certification:</span> {product.certification}
                                </li>
                            )}
                            {product.ring_size && (
                                <li>
                                    <span className="font-medium text-gray-800">Ring Size:</span> {product.ring_size}
                                </li>
                            )}
                            {product.length && (
                                <li>
                                    <span className="font-medium text-gray-800">Length:</span> {product.length} mm
                                </li>
                            )}
                            {product.width && (
                                <li>
                                    <span className="font-medium text-gray-800">Width:</span> {product.width} mm
                                </li>
                            )}
                            <li>
                                <span className="font-medium text-gray-800">Includes:</span> Certificate of Authenticity & Jewelry Box
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            

            {/* Shipping Section */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection("shipping")}
                    className="w-full py-4 flex justify-between items-center text-left"
                >
                    <span className="text-xs font-bold tracking-wider text-[#1E2856] uppercase">Shipping & Returns</span>
                    {openSection === "shipping" ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {openSection === "shipping" && (
                    <div className="pb-6 text-sm text-gray-600">
                        <p>
                            Free shipping on all orders above ₹2000. Returns accepted within 30 days of delivery.
                        </p>
                    </div>
                )}
            </div>
            {/* Ratings & Reviews Section */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection("reviews")}
                    className="w-full py-4 flex justify-between items-center text-left"
                >
                    <span className="text-xs font-bold tracking-wider text-[#1E2856] uppercase">Ratings & Reviews</span>
                    {openSection === "reviews" ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {openSection === "reviews" && (
                    <div className="pb-6">
                        <ReviewSection productId={product.id} />
                    </div>
                )}
            </div>
        </div>
    );
}
