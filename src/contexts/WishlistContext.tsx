"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '@/lib/mockData';
import { favoritesApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface WishlistContextType {
    wishlistItems: Product[];
    addToWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (productId: string | number) => Promise<void>;
    isInWishlist: (productId: string | number) => boolean;
    clearWishlist: () => Promise<void>;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated, promptLogin } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch wishlist from backend on load or auth change
    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
        }
    }, [isAuthenticated, user]);

    const fetchWishlist = async () => {
        try {
            setIsLoading(true);
            const response = await favoritesApi.getFavorites();
            if (response.success && response.data) {
                // Determine the correct array holding the wishlist data.
                // It could be response.data (if mapped directly), response.data.items (standard struct from favorite.controller.js), or response.data.data.
                let favoritesArray: any[] = [];
                if (Array.isArray(response.data)) {
                    favoritesArray = response.data;
                } else if (response.data.items && Array.isArray(response.data.items)) {
                    favoritesArray = response.data.items;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    favoritesArray = response.data.data;
                }

                const mappedFavorites = favoritesArray.map((item: any) =>
                    item.product ? item.product : item
                );
                setWishlistItems(mappedFavorites);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToWishlist = async (product: Product) => {
        if (!isAuthenticated) {
            toast.error("Please login to add to wishlist");
            promptLogin();
            return;
        }

        try {
            // Optimistic UI update
            setWishlistItems(prev => {
                if (prev.some(item => item.id === product.id)) return prev;
                return [...prev, product];
            });

            await favoritesApi.addToFavorites(Number(product.id));
            toast.success('Added to wishlist successfully');
        } catch (error: any) {
            toast.error(error.message || "Failed to add to wishlist");
            fetchWishlist(); // Revert
        }
    };

    const removeFromWishlist = async (productId: string | number) => {
        if (!isAuthenticated) return;

        try {
            // Optimistic UI update
            setWishlistItems(prev => prev.filter(item => item.id !== productId));

            await favoritesApi.removeFromFavorites(Number(productId));
            toast.success('Removed from wishlist');
        } catch (error: any) {
            toast.error(error.message || "Failed to remove from wishlist");
            fetchWishlist(); // Revert
        }
    };

    const isInWishlist = (productId: string | number) => {
        return wishlistItems.some(item => item.id === productId);
    };

    const clearWishlistContext = async () => {
        // usually wishlist clear is not a single API, we just empty frontend state
        if (!isAuthenticated) return;
        setWishlistItems([]);
        // optionally, call backend to remove all if API supports it
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            clearWishlist: clearWishlistContext,
            isLoading
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
