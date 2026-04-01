"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

type MediaItem = {
    id: number;
    type: "image" | "video";
    src: string;
    spanClassName: string; // Tailwing classes for desktop layout
    mobileSpanClassName: string; // Tailwind classes for mobile layout
};

// Creating the items array to precisely mimic the user's requested grid
const mediaItems: MediaItem[] = [
    // Top Row (4 items on desktop)
    { 
        id: 1, 
        type: 'image', 
        src: '/images/grid/images/grid1.png', 
        spanClassName: 'lg:col-span-1 lg:row-span-1',
        mobileSpanClassName: 'col-span-1 row-span-1'
    },
    { 
        id: 2, 
        type: 'image', 
        src: '/images/grid/images/grid2.png', 
        spanClassName: 'lg:col-span-1 lg:row-span-1',
        mobileSpanClassName: 'col-span-1 row-span-1'
    },
    { 
        id: 3, 
        type: 'image', 
        src: '/images/grid/images/grid3.jpg', 
        spanClassName: 'lg:col-span-1 lg:row-span-1',
        mobileSpanClassName: 'col-span-1 row-span-1'
    },
    { 
        id: 4, 
        type: 'video', 
        src: '/images/grid/videos/1772560354680_Video_Generation_with_Clothing_Options.mp4', 
        spanClassName: 'lg:col-span-2 lg:row-span-1',
        mobileSpanClassName: 'col-span-1 sm:col-span-2 lg:col-span-2 row-span-1'
    },
    
    // Remaining Rows
    { 
        id: 5, 
        type: 'image', 
        src: '/images/grid/images/grid4.jpg', 
        spanClassName: 'lg:col-span-2 lg:row-span-2', // Large spanning image
        mobileSpanClassName: 'col-span-2 row-span-2'
    },
    { 
        id: 6, 
        type: 'image', 
        src: '/images/grid/images/grid5.jpg', 
        spanClassName: 'lg:col-span-1 lg:row-span-1',
        mobileSpanClassName: 'col-span-1 row-span-1'
    },
    { 
        id: 7, 
        type: 'video', 
        src: '/images/grid/videos/1772617746658_Whisk_gtz0qdzwcjzkvjmh1sm0mwytkjy2qtl5i2m40cn.mp4',
        spanClassName: 'lg:col-span-1 lg:row-span-1',
        mobileSpanClassName: 'col-span-1 row-span-1'
    },
    { 
        id: 8, 
        type: 'image', 
        src: '/images/grid/images/grid6.jpg', 
        spanClassName: 'lg:col-span-1 lg:row-span-1',
        mobileSpanClassName: 'col-span-1 row-span-1'
    },
    { 
        id: 9, 
        type: 'image', 
        src: '/images/grid/images/grid7.jpg', 
        spanClassName: 'lg:col-span-1 lg:row-span-1',
        mobileSpanClassName: 'col-span-1 row-span-1'
    },
    { 
        id: 10, 
        type: 'image', 
        src: '/images/grid/images/grid8.jpg', 
        spanClassName: 'lg:col-span-1 lg:row-span-1',
        mobileSpanClassName: 'col-span-1 row-span-1'
    },
    { 
        id: 11, 
        type: 'image', 
        src: '/images/grid/images/grid9.jpg', 
        spanClassName: 'lg:col-span-1 lg:row-span-1',
        mobileSpanClassName: 'col-span-2 lg:col-span-1 row-span-1'
    },
];

export default function MediaGrid() {
    return (
        <section className="py-8 md:py-16 bg-white w-full" id="social-grid">
            <div className="w-full">
                {/* No max-width wrapper, true edge-to-edge full width grid like reference */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 auto-rows-[200px] sm:auto-rows-[250px] md:auto-rows-[300px] xl:auto-rows-[350px]">
                    {mediaItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            viewport={{ once: true, margin: "-10%" }}
                            className={`${item.mobileSpanClassName} ${item.spanClassName} relative group overflow-hidden bg-gray-100/50 block`}
                        >
                            {/* Hover overlay dark effect */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10 pointer-events-none" />
                            
                            {item.type === 'video' ? (
                                <>
                                    <video
                                        src={item.src}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover transform scale-[1.01] group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                                    />
                                    {/* Small icon just for video indicators */}
                                    <div className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full backdrop-blur z-20 shadow-md">
                                        <Play className="w-4 h-4 text-[#1E1E1E] fill-current" strokeWidth={1} />
                                    </div>
                                </>
                            ) : (
                                <img
                                    src={item.src}
                                    alt={`Social gallery content ${item.id}`}
                                    className="w-full h-full object-cover transform scale-[1.01] group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
                
                {/* Optional subtle follow us link underneath */}
                <div className="w-full text-center mt-8">
                    <a href="#" className="inline-block text-[#1E1E1E] text-sm md:text-base font-serif uppercase tracking-[0.2em] font-medium border-b border-[#1E1E1E] pb-1 hover:text-[#C8A165] hover:border-[#C8A165] transition-colors">
                        Follow @Jashoda on Instagram
                    </a>
                </div>
            </div>
        </section>
    );
}
