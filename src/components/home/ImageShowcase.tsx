import React from 'react';
import Image from 'next/image';

const images = [
    {
        src: '/images/home_cards/black_posture_1.png',
        alt: 'Black Posture Collection',
        title: 'Black Posture',
    },
    {
        src: '/images/home_cards/sand_posture_1.png',
        alt: 'Sand Posture Collection',
        title: 'Sand Posture',
    },
    {
        src: '/images/home_cards/silver_posture_1.jpg',
        alt: 'Silver Posture Collection',
        title: 'Silver Posture',
    },
];

export default function ImageShowcase() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-serif text-[#832729] text-center mb-12">
                    Featured Collections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {images.map((image, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg aspect-[3/4] cursor-pointer">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                            <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                                <h3 className="text-2xl font-serif text-white mb-2">{image.title}</h3>
                                <span className="text-white/80 text-sm tracking-widest uppercase border-b border-transparent group-hover:border-white/50 pb-1 transition-all inline-block">
                                    View Collection
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
