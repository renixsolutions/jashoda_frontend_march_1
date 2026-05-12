"use client";

import React, { useState } from "react";
import { ShoppingBag, Heart, Share2 } from "lucide-react";
import { Product, Variant } from "@/lib/mockData";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PDPActions({ product }: { product: Product }) {
    const [pincode, setPincode] = useState("");
    const variants = typeof product.variants === 'string' 
        ? JSON.parse(product.variants) 
        : (product.variants || []);

    const [selectedSize, setSelectedSize] = useState<Variant | null>(
        variants && variants.length > 0 ? variants[0] : null
    );

    
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isInWishlistState = isInWishlist(product.id);
    const router = useRouter();

    const handleAddToCart = () => {
        if (variants && variants.length > 0 && !selectedSize) {

            toast.error('Please select a size');
            return;
        }
        
        addToCart(product, 1, selectedSize?.size_id, selectedSize?.size);
        toast.success(`Added ${product.name}${selectedSize ? ` (Size ${selectedSize.size})` : ''} to bag`);
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

    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out this ${product.name} on Jashoda Jewels!`,
            url: typeof window !== 'undefined' ? window.location.href : '',
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="flex flex-col gap-6 text-[#1E2856] mt-8">
            {/* Size Selection */}
            {variants && variants.length > 0 && (

                <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                            Select Size {selectedSize && selectedSize.diameter && <span className="normal-case font-medium ml-1">({selectedSize.diameter} diameter)</span>}
                        </label>
                        <button className="text-[10px] font-bold text-[#1E2856] underline uppercase tracking-tighter">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {variants.map((v: any) => (

                            <button
                                key={v.size_id}
                                onClick={() => setSelectedSize(v)}
                                className={`min-w-[48px] h-12 flex items-center justify-center border text-sm font-medium transition-all ${
                                    selectedSize?.size_id === v.size_id
                                        ? "border-[#1E2856] bg-[#1E2856] text-white shadow-md scale-105"
                                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                                } ${v.quantity <= 0 ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                                disabled={v.quantity <= 0}
                            >
                                {v.size}
                            </button>
                        ))}
                    </div>
                    
                    {/* Selected Size Stock info */}
                    {selectedSize && (
                        <div className="mt-3">
                            {selectedSize.quantity > 0 ? (
                                <p className={`text-xs font-medium ${selectedSize.quantity <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                                    {selectedSize.quantity <= 3 ? `Only ${selectedSize.quantity} pieces left in this size!` : 'In stock and ready to ship'}
                                </p>
                            ) : (
                                <p className="text-xs font-medium text-red-600">Out of stock in this size</p>
                            )}
                        </div>
                    )}
                </div>
            )}

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
                    disabled={selectedSize ? selectedSize.quantity <= 0 : (product.stock_quantity !== undefined && product.stock_quantity <= 0)}
                    className="flex-1 py-4 border border-[#1E2856] text-[#1E2856] font-bold tracking-widest text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#1E2856]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingBag className="w-5 h-5 mb-1" />
                    Add to Bag
                </button>
                <button
                    onClick={() => { handleAddToCart(); router.push('/cart'); }}
                    disabled={selectedSize ? selectedSize.quantity <= 0 : (product.stock_quantity !== undefined && product.stock_quantity <= 0)}
                    className="flex-1 py-4 bg-[#1E2856] text-white font-bold tracking-widest text-sm uppercase hover:bg-[#151b3b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-[#1E2856] uppercase"
                >
                    <Share2 className="w-4 h-4" /> Share
                </button>
            </div>
        </div>
    );
}
