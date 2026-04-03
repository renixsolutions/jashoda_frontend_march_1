"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
    const { isAuthenticated, isLoading, promptLogin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
            setTimeout(() => {
                promptLogin();
            }, 500);
        }
    }, [isAuthenticated, isLoading, router, promptLogin]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-3xl font-serif text-[#1E2856] mb-4">Your Bag is Empty</h1>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    Looks like you haven't added any pieces to your collection yet.
                </p>
                <Link href="/">
                    <Button className="bg-[#1E2856] text-white px-8 py-3 rounded-full hover:bg-[#151b3b]">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-4 pb-8 px-2 md:px-6 bg-[#FAFAFA] rounded-t-[2.5rem] shadow-sm -mt-4 relative z-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-serif text-[#1E2856] mb-8">Shopping Bag <span className="text-lg text-gray-500 font-sans">({totalItems} items)</span></h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-6">
                        {cartItems.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start">
                                {/* Image */}
                                <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                    <Image
                                        src={item.images ? item.images[0] : ("/images/placeholder.png")} // Fallback image
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-medium text-[#1E2856] mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.category} • {item.metalType || "Silver"}</p>
                                            {item.size && <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        {/* Quantity Control */}
                                        <div className="flex items-center border border-gray-200 rounded-lg h-9">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#1E2856]"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-10 text-center text-sm font-medium text-[#1E2856]">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#1E2856]"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <p className="text-lg font-bold text-[#1E2856]">₹{((item.discount_price ? Number(item.discount_price) : item.price) * item.quantity).toLocaleString()}</p>
                                                {item.discount_price && Number(item.discount_price) < item.price && (
                                                    <p className="text-sm text-gray-400 line-through">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                )}
                                            </div>
                                            {item.quantity > 1 && (
                                                <p className="text-xs text-gray-400">₹{(item.discount_price ? Number(item.discount_price) : item.price).toLocaleString()} each</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 sticky top-32">
                            <h2 className="text-xl font-serif text-[#1E2856] mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (GST)</span>
                                    <span>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-medium text-[#1E2856]">Total</span>
                                    <span className="text-2xl font-bold text-[#1E2856] font-serif">₹{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="block w-full">
                                <Button className="w-full h-14 bg-[#1E2856] text-white hover:bg-[#151b3b] text-lg font-medium rounded-lg flex items-center justify-center gap-2">
                                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                Secure Checkout • Free Returns • 100% Authentic
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
