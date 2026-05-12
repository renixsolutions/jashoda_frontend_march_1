"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Star, Layers, Play, Film } from "lucide-react";

export default function PDPGallery({ images, videoUrl, rating, reviews }: { images: any[], videoUrl?: string, rating?: number, reviews?: number }) {
    // Map items to get string URLs
    const imageUrls = images.map(img => typeof img === 'string' ? img : img?.url).filter(Boolean);
    // Ensure we always have at least one image to prevent errors
    const safeImages = imageUrls.length > 0 ? imageUrls : ["/diamond-pendant.png"];
    
    // selected state can now be an image URL or a special string "video"
    const [selected, setSelected] = useState<string>(safeImages[0]);

    useEffect(() => {
        if (safeImages.length > 0) setSelected(safeImages[0]);
    }, [images]);

    return (
        <div className="flex flex-col gap-6">
            {/* Main View */}
            <div className="relative bg-[#F8F8F8] border border-gray-100/50 rounded-[40px] overflow-hidden h-[500px] md:h-[700px] w-full transition-all duration-500 group shadow-sm hover:shadow-md">
                {selected === "video" && videoUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        <video 
                            src={videoUrl} 
                            controls 
                            autoPlay 
                            className="max-w-full max-h-full"
                        />
                    </div>
                ) : (
                    <Image
                        src={selected}
                        alt="Product Main View"
                        fill
                        className="object-cover mix-blend-multiply transition-all duration-700 group-hover:scale-110"
                        unoptimized={selected.startsWith('http')}
                    />
                )}

                {/* Rating Badge */}
                {(rating !== undefined || reviews !== undefined) && (
                    <div className="absolute bottom-6 left-6 z-10 flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-black/5">
                        <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                        <span className="text-sm font-semibold text-gray-700">
                            {rating !== undefined && rating !== null ? rating : '0.0'} | {reviews !== undefined && reviews !== null ? reviews : '0'}
                        </span>
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            <div className="flex flex-row gap-4 overflow-x-auto no-scrollbar py-1">
                {/* Images */}
                {safeImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelected(img)}
                        className={cn(
                            "relative w-20 h-20 md:w-24 md:h-24 border-2 rounded-xl overflow-hidden transition-all duration-300 shrink-0",
                            selected === img
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

                {/* Video Thumbnail */}
                {videoUrl && (
                    <button
                        onClick={() => setSelected("video")}
                        className={cn(
                            "relative w-20 h-20 md:w-24 md:h-24 border-2 rounded-xl overflow-hidden transition-all duration-300 shrink-0 bg-black flex flex-col items-center justify-center gap-1",
                            selected === "video"
                                ? "border-[#1E2856] ring-2 ring-[#1E2856]/10"
                                : "border-gray-100 hover:border-gray-300"
                        )}
                    >
                        <Play className="w-8 h-8 text-white fill-white" />
                        <span className="text-[10px] text-white font-bold uppercase tracking-tighter">Video</span>
                    </button>
                )}
            </div>
        </div>
    );
}
