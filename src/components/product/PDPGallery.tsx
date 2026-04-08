"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Star, Layers } from "lucide-react";

export default function PDPGallery({ images, rating, reviews }: { images: any[], rating?: number, reviews?: number }) {
    // Map items to get string URLs
    const imageUrls = images.map(img => typeof img === 'string' ? img : img?.url).filter(Boolean);
    // Ensure we always have at least one image to prevent errors
    const safeImages = imageUrls.length > 0 ? imageUrls : ["/diamond-pendant.png"];
    const [selectedImage, setSelectedImage] = useState(safeImages[0]);

    useEffect(() => {
        if (safeImages.length > 0) setSelectedImage(safeImages[0]);
    }, [images]);

    return (
        <div className="flex flex-col-reverse md:flex-row gap-6 h-full">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 shrink-0 py-1">
                {safeImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                            "relative w-20 h-20 md:w-24 md:h-24 border-2 rounded-xl overflow-hidden transition-all duration-300 shrink-0",
                            selectedImage === img
                                ? "border-[#1E2856] shadow-sm ring-2 ring-[#1E2856]/10"
                                : "border-gray-100 bg-gray-50 hover:border-gray-300"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`Product view ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized={img.startsWith('http')}
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative bg-[#F8F8F8] border border-gray-100/50 rounded-[40px] overflow-hidden min-h-[450px] md:min-h-[750px] w-full transition-all duration-500 group cursor-zoom-in shadow-sm hover:shadow-md">
                <Image
                    src={selectedImage}
                    alt="Product Main View"
                    fill
                    className="object-cover mix-blend-multiply transition-all duration-700 group-hover:scale-110"
                    unoptimized={selectedImage.startsWith('http')}
                />

                {/* Rating Badge */}
                {(rating !== undefined || reviews !== undefined) && (
                    <div className="absolute bottom-6 left-6 z-10 flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-black/5">
                        <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                        <span className="text-sm font-semibold text-gray-700">
                            {rating !== undefined && rating !== null ? rating : '0.0'} | {reviews !== undefined && reviews !== null ? reviews : '0'}
                        </span>
                    </div>
                )}

                {/* Gallery/QuickView Icon */}
                {/* <div className="absolute bottom-6 right-6 z-10 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-black/5 hover:bg-white transition-colors cursor-pointer group/icon">
                    <Layers className="w-5 h-5 text-gray-500 group-hover/icon:text-[#1E2856] transition-colors" />
                </div> */}
            </div>
        </div>
    );
}
