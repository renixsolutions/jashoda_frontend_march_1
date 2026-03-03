"use client";

import React from "react";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { PRODUCTS as MOCK_PRODUCTS } from "@/lib/mockData";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const products = [
    {
        id: 1,
        title: "Floral Silver Drop Earrings",
        price: "1,899",
        originalPrice: "3,500",
        discount: "46% OFF",
        rating: 4.5,
        image: "/sil1.png", // placeholder
        tag: "NEW",
        tagColor: "bg-blue-900"
    },
    {
        id: 2,
        title: "Silver Ganesha Idol",
        price: "12,500",
        originalPrice: "15,000",
        discount: "17% OFF",
        rating: 4.9,
        image: "/silver-idols.png", // placeholder
        tag: "LIMITED STOCK",
        tagColor: "bg-red-600"
    },
    {
        id: 3,
        title: "Elegant Silver Choker",
        price: "8,999",
        originalPrice: "12,000",
        discount: "25% OFF",
        rating: 4.7,
        image: "/diamond-pendant.png", // placeholder
        tag: "NEW",
        tagColor: "bg-blue-900"
    },
    {
        id: 4,
        title: "Pure Silver Pooja Thali Set",
        price: "18,500",
        originalPrice: "22,000",
        discount: "16% OFF",
        rating: 5.0,
        image: "/luxury-product-thumb.png", // placeholder
        tag: "PREMIUM",
        tagColor: "bg-red-700"
    }
];

export default function PDPRelated() {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    return (
        <div className="py-16">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-serif text-[#1E2856]">You May Also Like</h2>
                <button className="text-xs font-bold text-gray-400 tracking-widest hover:text-[#1E2856] uppercase flex items-center gap-1">
                    View All <span className="text-lg">→</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="group cursor-pointer">
                        <div className="relative aspect-square mb-4 bg-[#F5F5F5] overflow-hidden">
                            {/* Tag */}
                            {product.tag && (
                                <span className={`absolute top-2 left-2 ${product.tagColor} text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider z-10`}>
                                    {product.tag}
                                </span>
                            )}

                            {/* Wishlist */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fullProduct = MOCK_PRODUCTS.find(p => p.id === String(product.id)) || MOCK_PRODUCTS[0];
                                    if (fullProduct) {
                                        if (isInWishlist(fullProduct.id)) {
                                            removeFromWishlist(fullProduct.id);
                                        } else {
                                            addToWishlist(fullProduct);
                                        }
                                    }
                                }}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white z-10 transition-colors"
                            >
                                <Heart className={`w-4 h-4 ${isInWishlist(String(product.id)) ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`} />
                            </button>

                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Add to Cart Overlay */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fullProduct = MOCK_PRODUCTS.find(p => p.id === String(product.id)) || MOCK_PRODUCTS[0];
                                    addToCart(fullProduct);
                                }}
                                className="absolute bottom-0 left-0 w-full bg-white/90 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 text-[#1E2856] text-xs font-bold tracking-widest uppercase border-t border-gray-100 hover:bg-[#1E2856] hover:text-white"
                            >
                                <ShoppingBag className="w-3 h-3" />
                                ADD TO CART
                            </button>
                        </div>

                        <div className="flex items-center gap-1 mb-1">
                            <StarRating rating={product.rating} />
                        </div>

                        <h3 className="text-[#1E2856] font-medium text-sm mb-1 group-hover:text-blue-800 transition-colors">
                            {product.title}
                        </h3>

                        <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1E2856]">₹{product.price}</span>
                            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                            <span className="text-xs text-red-500 font-medium">({product.discount})</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs font-medium text-gray-500 ml-1">{rating}</span>
        </div>
    )
}
