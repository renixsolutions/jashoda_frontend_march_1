"use client";

import React, { useState } from "react";
import { ShoppingBag, Heart, Share2, ChevronDown, ChevronUp } from "lucide-react";
import { Product, Variant } from "@/lib/mockData";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PDPActions({ product }: { product: Product }) {
    const variants = typeof product.variants === 'string' 
        ? JSON.parse(product.variants) 
        : (product.variants || []);

    const [selectedSize, setSelectedSize] = useState<Variant | null>(
        variants && variants.length > 0 ? variants[0] : null
    );

    // Accordion state for switched Product Description block
    const [isDescOpen, setIsDescOpen] = useState(true);

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
    };

    const handleToggleWishlist = () => {
        if (isInWishlistState) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
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
        <div className="flex flex-col gap-6 text-[#1E2856] mt-8 select-none w-full">
            {/* Size Selection */}
            {variants && variants.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                            Select Size {selectedSize && selectedSize.diameter && <span className="normal-case font-medium ml-1">({selectedSize.diameter} diameter)</span>}
                        </label>
                        <button className="text-[10px] font-bold text-[#31111B] underline uppercase tracking-tighter cursor-pointer">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {variants.map((v: any) => (
                            <button
                                key={v.size_id}
                                onClick={() => setSelectedSize(v)}
                                className={`min-w-[48px] h-12 flex items-center justify-center border text-sm font-medium transition-all rounded-lg cursor-pointer ${
                                    selectedSize?.size_id === v.size_id
                                        ? "border-[#31111B] bg-[#31111B] text-[#D4AF37] shadow-md scale-105 font-bold"
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

            {/* Switched Section: Product Description sits here above Add to Bag */}
            <div className="w-full pt-1">
                <button
                    onClick={() => setIsDescOpen(!isDescOpen)}
                    className="w-full flex justify-between items-center text-left mb-2 cursor-pointer"
                >
                    <span className="text-xs font-serif font-bold tracking-widest text-[#31111B] uppercase">
                        Product Description
                    </span>
                    {isDescOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {isDescOpen && (
                    <div className="text-xs text-gray-600 space-y-3 pt-2 transition-all w-full">
                        <p className="leading-relaxed text-gray-700 font-sans">
                            {product.description || `Handcrafted with precision for a timeless piece of elegance.`}
                        </p>
                        
                        {/* Impeccable row-by-row Table inline specs list */}
                        <div className="space-y-1.5 pt-2 border-t border-gray-100 font-sans w-full">
                            <div className="flex justify-between items-center py-1 border-b border-gray-50 text-xs">
                                <span className="text-gray-500 font-medium">Metal</span>
                                <span className="font-semibold text-gray-900">
                                    {product.purity ? `${product.purity} ` : ''}{product.metal_type || product.metalType || 'Silver'}
                                </span>
                            </div>
                            {product.metal_weight && (
                                <div className="flex justify-between items-center py-1 border-b border-gray-50 text-xs">
                                    <span className="text-gray-500 font-medium">Metal Weight</span>
                                    <span className="font-semibold text-gray-900">{product.metal_weight}g</span>
                                </div>
                            )}
                            {(product.category_name || product.category) && (
                                <div className="flex justify-between items-center py-1 border-b border-gray-50 text-xs">
                                    <span className="text-gray-500 font-medium">Category</span>
                                    <span className="font-semibold text-gray-900">{product.category_name || product.category}</span>
                                </div>
                            )}
                            {(product.stone_type || product.stoneType) && (
                                <div className="flex justify-between items-center py-1 border-b border-gray-50 text-xs">
                                    <span className="text-gray-500 font-medium">Stone Setting</span>
                                    <span className="font-semibold text-gray-900">{product.stone_type || product.stoneType}</span>
                                </div>
                            )}
                            {product.stone_weight && (
                                <div className="flex justify-between items-center py-1 border-b border-gray-50 text-xs">
                                    <span className="text-gray-500 font-medium">Stone Carat</span>
                                    <span className="font-semibold text-gray-900">{product.stone_weight} Ct</span>
                                </div>
                            )}
                            {product.certification && (
                                <div className="flex justify-between items-center py-1 border-b border-gray-50 text-xs">
                                    <span className="text-gray-500 font-medium">Certification</span>
                                    <span className="font-semibold text-gray-900">{product.certification}</span>
                                </div>
                            )}
                            <div className="pt-2 text-[11px] text-[#C5A059] font-medium flex items-center justify-between">
                                <span className="text-gray-500">Includes</span>
                                <span className="font-semibold text-gray-800">Authenticity Certificate & Box</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2 w-full">
                <button
                    onClick={handleAddToCart}
                    disabled={selectedSize ? selectedSize.quantity <= 0 : (product.stock_quantity !== undefined && product.stock_quantity <= 0)}
                    className="flex-1 py-4 rounded-xl border border-[#31111B] text-[#31111B] font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#31111B]/5 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed box-border"
                >
                    <ShoppingBag className="w-4 h-4 mb-0.5 text-[#D4AF37]" />
                    Add to Bag
                </button>
                <button
                    onClick={() => { handleAddToCart(); router.push('/cart'); }}
                    disabled={selectedSize ? selectedSize.quantity <= 0 : (product.stock_quantity !== undefined && product.stock_quantity <= 0)}
                    className="flex-1 py-4 rounded-xl bg-[#31111B] text-[#D4AF37] font-bold tracking-widest text-xs uppercase hover:bg-[#4a1825] transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed box-border"
                >
                    Buy It Now
                </button>
            </div>

            {/* Wishlist/Share */}
            <div className="flex items-center justify-center gap-8 pt-2 border-t border-gray-100/60 mt-1 w-full">
                <button
                    onClick={handleToggleWishlist}
                    className={`flex items-center gap-2 text-xs font-medium uppercase transition-colors cursor-pointer ${isInWishlistState ? 'text-rose-500 font-bold' : 'text-gray-500 hover:text-[#31111B]'}`}
                >
                    <Heart className={`w-4 h-4 ${isInWishlistState ? 'fill-current text-rose-500' : ''}`} />
                    {isInWishlistState ? 'Wishlisted' : 'Wishlist'}
                </button>
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-[#31111B] uppercase transition-colors cursor-pointer"
                >
                    <Share2 className="w-4 h-4" /> Share
                </button>
            </div>
        </div>
    );
}
