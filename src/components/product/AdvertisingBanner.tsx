import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface AdCardProps {
    title: string;
    image: string;
}

const AdCard = ({ title, image }: AdCardProps) => (
    <div className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
        <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-serif text-lg font-medium text-center">{title}</h3>
        </div>
    </div>
);

export default function AdvertisingBanner() {
    return (
        <div className="w-full relative overflow-hidden rounded-3xl my-12">
            {/* Background with blur/gradient */}
            <div className="absolute inset-0 bg-[#832729] z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2670&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 px-8 py-12 md:px-16 md:py-16">
                <div className="flex flex-col items-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-2 text-center">Dailywear Jewellery</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#F2D7A1] to-transparent opacity-50"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <AdCard
                        title="Dailywear Rings"
                        image="/luxury-product-thumb.png"
                    />
                    <AdCard
                        title="Dailywear Earrings"
                        image="/sil1.png"
                    />
                    <AdCard
                        title="Dailywear Mangalsutra"
                        image="/diamond-pendant.png"
                    />
                </div>

                {/* Navigation buttons (Purely visual mainly, or could be carousel controls) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8">
                    <button className="p-3 rounded-full border border-white/20 text-white/50 hover:bg-white/10 hover:text-white transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8">
                    <button className="p-3 rounded-full border border-white/20 text-white/50 hover:bg-white/10 hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
