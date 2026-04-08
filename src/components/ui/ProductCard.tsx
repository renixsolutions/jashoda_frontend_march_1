"use client";

import React from "react";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";



import Link from "next/link";
import { Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product as MockProduct } from "@/lib/mockData";
import { toast } from "react-hot-toast";

interface ProductCardProps {
    product: MockProduct & { image?: string | any, image_url?: string };
    variant?: 'light' | 'dark';
}

export default function ProductCard({ product, variant = 'light' }: ProductCardProps) {
    const isDark = variant === 'dark';
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isInWishlistState = isInWishlist(product.id);

    const [currentImgIndex, setCurrentImgIndex] = React.useState(0);

    // Extract valid images into an array for the slider
    const validImages: string[] = [];
    
    let mainImg = '';
    if (typeof product.image === 'string' && product.image !== '/images/placeholder.jpg') {
        mainImg = product.image;
    } else if (product.image && typeof product.image === 'object' && product.image.url) {
        mainImg = product.image.url;
    } else if (product.image_url) {
        mainImg = product.image_url;
    }

    if (mainImg) validImages.push(mainImg);

    if (product.images && Array.isArray(product.images)) {
        product.images.forEach((img: any) => {
            const url = typeof img === 'string' ? img : img?.url;
            if (url && url !== '/images/placeholder.jpg' && !validImages.includes(url)) {
                validImages.push(url);
            }
        });
    }

    if (validImages.length === 0) {
        validImages.push('/diamond-pendant.png'); // safe fallback
    }

    // Auto-slide effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (validImages.length > 1) {
            interval = setInterval(() => {
                setCurrentImgIndex((prev) => (prev + 1) % validImages.length);
            }, 2500); // Crossfade image every 2.5 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [validImages.length]);

    // Safely parse prices to numbers for calculations
    const displayPrice = product.discount_price
        ? Number(product.discount_price)
        : Number(product.price);

    const originalPriceNum = product.discount_price
        ? Number(product.price)
        : null;

    // Calculate discount percentage
    const discountPercentage = originalPriceNum && displayPrice
        ? Math.round(((originalPriceNum - displayPrice) / originalPriceNum) * 100)
        : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWishlistState) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative w-full flex-shrink-0 bg-transparent rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
            {/* Badge Overlay */}
            {product.badge && (
                <div className={`absolute top-4 left-4 z-20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md rounded ${product.badge === 'Best Seller' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-rose-400 to-rose-600'
                    }`}>
                    {product.badge}
                </div>
            )}

            {/* Low Stock Badge */}
            {product.stock_quantity !== undefined && product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                <div className={`absolute top-4 ${product.badge ? 'left-[100px]' : 'left-4'} z-20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#832729] bg-white/90 backdrop-blur-sm border border-[#832729]/20 shadow-sm rounded-full flex items-center gap-1.5 animate-pulse`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Only {product.stock_quantity} Left
                </div>
            )}

            {/* Wishlist Button */}
            <button
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-all transform hover:scale-110 ${isInWishlistState
                    ? 'bg-rose-500 text-white shadow-md'
                    : isDark ? 'bg-black/20 text-white hover:bg-black/40 hover:text-[#F2D7A1]' : 'bg-white/80 text-[#832729] hover:bg-white hover:shadow-md'
                    }`}
            >
                <Heart className={`w-5 h-5 ${isInWishlistState ? 'fill-current' : ''}`} />
            </button>

            {/* Image Container with Slider Effect */}
            <Link href={`/product/${product.id || product.slug}`} className={`block relative h-[380px] w-full overflow-hidden rounded-2xl ${isDark ? 'bg-black/20' : 'bg-[#F9F9F9]'}`}>
                {validImages.map((imgUrl, idx) => (
                    <Image
                        key={`${imgUrl}-${idx}`}
                        src={imgUrl}
                        alt={`${product.name} - ${idx + 1}`}
                        fill
                        className={`object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-110 ${
                            idx === currentImgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                        unoptimized={imgUrl.startsWith('http')}
                    />
                ))}

                {/* Slider Indicators */}
                {validImages.length > 1 && (
                    <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-1.5 z-20">
                        {validImages.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${idx === currentImgIndex ? 'w-4 bg-[#832729] opacity-100' : 'w-1.5 bg-gray-300 opacity-60'}`} 
                            />
                        ))}
                    </div>
                )}

                {/* Quick Add Overlay - Animated Up */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-30 glass-effect">
                    <Button className={`w-full shadow-lg font-serif tracking-wide ${isDark ? 'bg-white text-[#702540] hover:bg-white/90 rounded-md py-3' : 'bg-[#832729] text-white hover:bg-[#6b1f21] rounded-none py-4'}`} onClick={handleAddToCart}>
                        <ShoppingBag className="w-4 h-4 mr-2" /> {isDark ? 'Quick Add' : 'ADD TO CART'}
                    </Button>
                </div>
            </Link>

            {/* Product Details */}
            <div className={`pt-5 text-left px-3 ${isDark ? 'px-2' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                    <Link href={`/product/${product.id}`}>
                        <h3 className={`text-base font-sans leading-tight transition-colors line-clamp-2 pr-4 ${isDark ? 'text-white/90 hover:text-white font-medium' : 'text-[#404040] hover:text-[#832729] font-medium'}`}>{product.name}</h3>
                    </Link>
                </div>

                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    fill={i < Math.floor(product.rating || 0) ? "#F2D7A1" : "none"}
                                    className={i < Math.floor(product.rating || 0) ? "text-[#F2D7A1]" : "text-gray-300"}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-400 ml-1">({product.rating})</span>
                    </div>
                )}

                <div className="flex items-baseline gap-3 mt-2">
                    <p className={`font-bold font-serif text-lg whitespace-nowrap ${isDark ? 'text-[#F2D7A1]' : 'text-[#832729]'}`}>₹ {displayPrice.toLocaleString()}</p>
                    {originalPriceNum && discountPercentage > 0 && (
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-400 line-through">₹ {originalPriceNum.toLocaleString()}</p>
                            <span className="text-xs font-bold text-green-600 px-1.5 py-0.5 bg-green-50 rounded">
                                {discountPercentage}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {isDark && <p className="text-xs text-white/50 uppercase tracking-widest mt-1">{product.category}</p>}
            </div>
        </motion.div>
    );
}
