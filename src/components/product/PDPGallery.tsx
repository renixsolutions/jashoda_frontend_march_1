"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function PDPGallery({ images }: { images: any[] }) {
    // Map items to get string URLs
    const imageUrls = images.map(img => typeof img === 'string' ? img : img?.url).filter(Boolean);
    // Ensure we always have at least one image to prevent errors
    const safeImages = imageUrls.length > 0 ? imageUrls : ["/diamond-pendant.png"];
    const [selectedImage, setSelectedImage] = useState(safeImages[0]);

    useEffect(() => {
        if (safeImages.length > 0) setSelectedImage(safeImages[0]);
    }, [images]);

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 shrink-0">
                {safeImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                            "relative w-20 h-20 md:w-24 md:h-24 border-2 overflow-hidden transition-all",
                            selectedImage === img
                                ? "border-[#1E2856]" // Dark blue from screenshot
                                : "border-transparent hover:border-gray-300"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`Product view ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative bg-[#F5F5F5] min-h-[400px] md:min-h-[600px] w-full">
                <Image
                    src={selectedImage}
                    alt="Product Main View"
                    fill
                    className="object-contain p-4 mix-blend-multiply"
                />
            </div>
        </div>
    );
}
