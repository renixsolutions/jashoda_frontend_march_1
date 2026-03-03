"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Minus, Plus, ShoppingBag, Heart, Share2, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ARTryOn from "./ARTryOn";
import { PRODUCTS } from "@/lib/mockData";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

export default function ProductInfo() {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("7");
    const [isAROpen, setIsAROpen] = useState(false);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const sizes = ["5", "6", "7", "8", "9"];

    return (
        <div className="flex flex-col gap-8">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-rose-gold">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-rose-gold" />
                        ))}
                    </div>
                    <span className="text-white/60 text-sm">(124 Reviews)</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 italic tracking-wide">Ethereal Diamond Ring</h1>
                <p className="text-3xl font-serif text-rose-gold font-light">₹15,999</p>
            </div>

            <div className="space-y-4">
                <p className="text-white/70 leading-relaxed font-light">
                    Handcrafted in pure 925 Sterling Silver, this ring features a mesmerizing design inspired by the celestial dance of stars. Perfect for adding a touch of elegance to any ensemble. A timeless piece that speaks of sophistication and grace.
                </p>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">925 Sterling Silver</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">Rhodium Plated</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">Certified</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-white/90 text-sm">
                    <span className="font-medium">Select Size</span>
                    <button className="underline hover:text-rose-gold">Size Guide</button>
                </div>
                <div className="flex gap-3">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${selectedSize === size
                                ? "bg-rose-gold text-charcoal border-rose-gold font-bold"
                                : "bg-transparent text-white/70 border-white/20 hover:border-rose-gold hover:text-rose-gold"
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center border border-white/20 rounded-full px-4 h-14 w-fit">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-white/70 hover:text-white p-2"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white w-8 text-center font-medium">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-white/70 hover:text-white p-2"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <Button
                    className="flex-1 h-14 bg-rose-gold text-charcoal hover:bg-white text-lg rounded-full font-serif tracking-wider"
                    magnetic
                    onClick={() => {
                        const product = PRODUCTS.find(p => p.id === "1") || PRODUCTS[0];
                        if (product) {
                            addToCart(product, quantity, selectedSize);
                        }
                    }}
                >
                    <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
                </Button>
                <Button
                    variant="outline"
                    className="h-14 w-14 rounded-full border-white/20 text-white/70 hover:bg-white hover:text-[#702540] p-0 flex items-center justify-center"
                    onClick={() => setIsAROpen(true)}
                >
                    <Camera className="w-6 h-6" />
                </Button>
                <button
                    onClick={() => {
                        const product = PRODUCTS.find(p => p.id === "1") || PRODUCTS[0];
                        if (product) {
                            if (isInWishlist(product.id)) {
                                removeFromWishlist(product.id);
                            } else {
                                addToWishlist(product);
                            }
                        }
                    }}
                    className={`h-14 w-14 rounded-full border border-white/20 flex items-center justify-center transition-all ${isInWishlist("1")
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'text-white/70 hover:bg-white hover:text-[#702540]'
                        }`}
                >
                    <Heart className={`w-6 h-6 ${isInWishlist("1") ? 'fill-current' : ''}`} />
                </button>
            </div>

            <div className="flex items-center gap-2 text-white/50 text-xs mt-4">
                <Share2 className="w-4 h-4" />
                <span>Free Shipping & 30-Day Returns</span>
            </div>
            {/* AR Modal */}
            <AnimatePresence>
                {isAROpen && <ARTryOn onClose={() => setIsAROpen(false)} />}
            </AnimatePresence>
        </div>
    );
}
