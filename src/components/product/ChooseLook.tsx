import React from "react";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface LookCardProps {
    label: string;
    image: string;
    className?: string;
}

const LookCard = ({ label, image, className = "" }: LookCardProps) => (
    <div className={`relative flex-shrink-0 group cursor-pointer ${className}`}>
        <div className="relative aspect-[3/4] w-48 md:w-56 overflow-hidden rounded-xl shadow-lg bg-gray-200">
            <Image
                src={image}
                alt={label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        </div>
        <p className="mt-3 text-center text-[#702540] font-medium font-serif">{label}</p>
    </div>
);

export default function ChooseLook() {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const looks = [
        { label: "Evening Look", image: "/luxury-product-thumb.png" },
        { label: "Casual Look", image: "/sil1.png" },
        { label: "Office Look", image: "/diamond-pendant.png" },
        { label: "Modern Look", image: "/diamond-bangle.png" }, // Centerpiece ideally
        { label: "Classic Look", image: "/luxury-product-thumb.png" },
        { label: "Party Look", image: "/sil1.png" },
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320; // Approximately one card width + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full relative overflow-hidden rounded-3xl my-12 bg-[#F5EFE6] py-12 px-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-serif text-[#832729] mb-2">Choose Your Look</h2>
                <div className="w-24 h-1 bg-[#832729] opacity-20 mx-auto"></div>
            </div>

            <div className="relative">
                {/* Simple Horizontal Scroll for now, can be upgraded to 3D carousel */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar justify-start items-end h-[400px]"
                >
                    {looks.map((look, index) => (
                        <div key={index} className={`snap-center transition-all duration-300 hover:-translate-y-4 ${index === 2 ? 'scale-110 z-10' : 'scale-90 opacity-80 hover:opacity-100 hover:scale-100'}`}>
                            <LookCard label={look.label} image={look.image} />
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute top-1/2 -translate-y-1/2 left-0 p-3 rounded-full bg-white/50 hover:bg-white text-[#702540] transition-all shadow-md z-20"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute top-1/2 -translate-y-1/2 right-0 p-3 rounded-full bg-white/50 hover:bg-white text-[#702540] transition-all shadow-md z-20"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
