"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { Category, Gender } from '@/lib/mockData';

interface NavigationData {
    genders: (Gender & { slug: string })[];
    occasions: { id: number, name: string, slug: string, image?: string, image_url?: string }[];
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const NavigationContext = createContext<NavigationData | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<NavigationData>({
        genders: [],
        occasions: [],
        categories: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                const [gendersRes, occasionsRes, categoriesRes] = await Promise.all([
                    api.getGenders().catch(() => ({ success: false, data: [] })),
                    api.getOccasions().catch(() => ({ success: false, data: [] })),
                    api.getParentCategories().catch(() => ({ success: false, data: [] }))
                ]);

                setData({
                    genders: (gendersRes.success && gendersRes.data) ? gendersRes.data : [],
                    occasions: (occasionsRes.success && occasionsRes.data) ? occasionsRes.data : [],
                    categories: (categoriesRes.success && categoriesRes.data) ? categoriesRes.data : [],
                    loading: false,
                    error: null
                });
            } catch (err) {
                console.error("Failed to fetch navigation data", err);
                setData(prev => ({ ...prev, loading: false, error: "Failed to load menu" }));
            }
        };

        fetchNavData();
    }, []);

    return (
        <NavigationContext.Provider value={data}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
}
