"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '@/lib/mockData';
import { cartApi } from '@/lib/api';
import toast from 'react-hot-toast';

export interface CartItem extends Product {
    quantity: number;
    size?: string;
    cart_item_id?: number; // Backend cart item ID
}

export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity?: number, size?: string) => Promise<void>;
    removeFromCart: (productId: string | number, cartItemId?: number) => Promise<void>;
    updateQuantity: (productId: string | number, quantity: number, cartItemId?: number) => Promise<void>;
    clearCart: () => Promise<void>;
    totalItems: number;
    totalPrice: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated, promptLogin } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch cart from backend on load or when user logs in
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            // Option to handle guest cart (e.g. localStorage)
            setCartItems([]);
        }
    }, [isAuthenticated, user]);

    const fetchCart = async () => {
        try {
            setIsLoading(true);
            const response = await cartApi.getCart();
            if (response.success && response.data) {
                // Map backend cart format to frontend format.
                // Assuming backend returns { items: [{ id, quantity, product: {...} }] }
                const mappedItems = response.data.items.map((item: any) => ({
                    ...item.product,
                    quantity: item.quantity,
                    cart_item_id: item.id
                }));
                setCartItems(mappedItems);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (product: Product, quantity: number = 1, size?: string) => {
        if (!isAuthenticated) {
            toast.error("Please login to add to cart");
            promptLogin();
            return;
        }

        try {
            // Optimistic update
            setCartItems(prev => {
                const existing = prev.find(item => item.id === product.id);
                if (existing) {
                    return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
                }
                return [...prev, { ...product, quantity, size }];
            });

            const res = await cartApi.addToCart(Number(product.id), quantity);
            if (res.success) {
                toast.success('Added to bag successfully');
                // Re-fetch to get correct item ids
                fetchCart();
            }
        } catch (error: any) {
            if (error?.message === 'Insufficient stock' || error?.message === 'Insufficient stock or product is out of stock') {
                toast.error("Max stock quantity reached");
            } else {
                toast.error(error?.message || "Failed to add to cart");
            }
            fetchCart(); // Revert on failure
        }
    };

    const removeFromCart = async (productId: string | number, cartItemId?: number) => {
        if (!isAuthenticated) return;

        const itemToRemove = cartItems.find(item => item.id === productId);
        const actualCartItemId = cartItemId || itemToRemove?.cart_item_id;

        if (!actualCartItemId) {
            console.error("Cannot remove item: cart_item_id not found for product", productId);
            toast.error("Failed to remove item: ID missing");
            return;
        }

        try {
            // Optimistic update
            setCartItems(prev => prev.filter(item => item.id !== productId));

            await cartApi.removeCartItem(Number(actualCartItemId));

        } catch (error: any) {
            toast.error(error.message || "Failed to remove item");
            fetchCart(); // Revert
        }
    };

    const updateQuantity = async (productId: string | number, quantity: number, cartItemId?: number) => {
        if (!isAuthenticated) return;

        if (quantity <= 0) {
            removeFromCart(productId, cartItemId);
            return;
        }

        try {
            const itemToUpdate = cartItems.find(item => item.id === productId);
            const idToUpdate = cartItemId || itemToUpdate?.cart_item_id || productId;

            // Optimistic update
            setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));

            await cartApi.updateCartItem(Number(idToUpdate), quantity);
        } catch (error: any) {
            if (error?.message === 'Insufficient stock' || error?.message === 'Insufficient stock or product is out of stock') {
                toast.error("Max stock quantity reached");
            } else {
                toast.error(error?.message || "Failed to update quantity");
            }
            fetchCart(); // Revert
        }
    };

    const clearCartContext = async () => {
        if (!isAuthenticated) return;
        try {
            setCartItems([]);
            await cartApi.clearCart();
        } catch (error) {
            fetchCart();
        }
    };

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + ((item.discount_price ? Number(item.discount_price) : item.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart: clearCartContext,
            totalItems,
            totalPrice,
            isLoading
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
