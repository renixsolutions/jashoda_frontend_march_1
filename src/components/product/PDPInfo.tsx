"use client";

import React, { useState } from "react";
import { Star, Heart, Share2, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/mockData";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PDPInfo({ product }: { product: Product }) {
    const [pincode, setPincode] = useState("");
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isInWishlistState = isInWishlist(product.id);
    const router = useRouter();

    const handleAddToCart = () => {
        addToCart(product);
        toast.success('Added to bag successfully');
    };

    const handleToggleWishlist = () => {
        if (isInWishlistState) {
            removeFromWishlist(product.id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist(product);
            toast.success('Added to wishlist successfully');
        }
    };

    return (
        <div className="flex flex-col gap-6 text-[#1E2856]"> {/* Dark Blue/Charcoal Text */}
            {/* ... (Header section unchanged) ... */}
            <div>
                <h1 className="text-4xl md:text-5xl font-serif font-medium mb-2">
                    {product.name}
                </h1>
                <div className="flex items-center gap-4 text-sm mb-4">
                    {product.rating && (
                        <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-0.5 rounded">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{product.rating}</span>
                        </div>
                    )}
                    {product.reviewCount && (
                        <span className="text-gray-500 border-r border-gray-300 pr-4">{product.reviewCount} Reviews</span>
                    )}
                    <span className="text-[#1E2856] font-semibold tracking-wide uppercase">{product.metalType}</span>
                </div>

                <div className="flex items-baseline gap-4 mt-4">
                    <span className="text-4xl font-bold">₹{(product.discount_price ? Number(product.discount_price) : Number(product.price)).toLocaleString()}</span>
                    {product.discount_price && (
                        <>
                            <span className="text-xl text-gray-400 line-through">₹{Number(product.price).toLocaleString()}</span>
                            <span className="text-red-500 font-medium">
                                ({Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)}% OFF)
                            </span>
                        </>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">MRP inclusive of all taxes. Free shipping on this item.</p>
            </div>

            {/* Pincode Check */}
            <div className="border-t border-gray-200 pt-6">
                <label className="text-xs font-bold tracking-wider text-gray-500 uppercase block mb-2">
                    Delivery Availability
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="flex-1 border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#1E2856]"
                    />
                    <button className="px-6 py-3 border border-black text-xs font-bold tracking-widest hover:bg-gray-50 transition-colors uppercase">
                        Check
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
                <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 border border-[#1E2856] text-[#1E2856] font-bold tracking-widest text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#1E2856]/5 transition-colors"
                >
                    <ShoppingBag className="w-5 h-5 mb-1" />
                    Add to Bag
                </button>
                <button
                    onClick={() => { handleAddToCart(); router.push('/cart'); }}
                    className="flex-1 py-4 bg-[#1E2856] text-white font-bold tracking-widest text-sm uppercase hover:bg-[#151b3b] transition-colors">
                    Buy It Now
                </button>
            </div>

            {/* Wishlist/Share */}
            <div className="flex items-center justify-center gap-8 pt-2">
                <button
                    onClick={handleToggleWishlist}
                    className={`flex items-center gap-2 text-xs font-medium uppercase hover:text-[#1E2856] ${isInWishlistState ? 'text-rose-500' : 'text-gray-500'}`}
                >
                    <Heart className={`w-4 h-4 ${isInWishlistState ? 'fill-current' : ''}`} />
                    {isInWishlistState ? 'Wishlisted' : 'Wishlist'}
                </button>
                <button className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-[#1E2856] uppercase">
                    <Share2 className="w-4 h-4" /> Share
                </button>
            </div>
        </div>
    );
}
