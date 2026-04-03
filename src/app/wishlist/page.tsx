"use client";

import React from "react";
import ProductCard from "@/components/ui/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WishlistPage() {
    const { wishlistItems } = useWishlist();
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
        return null; // Will redirect via useEffect
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-3xl font-serif text-[#1E2856] mb-4">Your Wishlist is Empty</h1>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    Save items you love here to easily find them later.
                </p>
                <Link href="/">
                    <Button className="bg-[#1E2856] text-white px-8 py-3 rounded-full hover:bg-[#151b3b]">
                        Discover Collections
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-4 pb-8 px-2 md:px-6 bg-[#FAFAFA] rounded-t-[2.5rem] shadow-sm -mt-4 relative z-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-serif text-[#1E2856] mb-8">My Wishlist <span className="text-lg text-gray-500 font-sans">({wishlistItems.length} items)</span></h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlistItems.map((product) => (
                        <div key={product.id}>
                            <ProductCard product={{ ...product, image: product.images && product.images.length > 0 ? product.images[0] : "/images/placeholder.png" } as any} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
