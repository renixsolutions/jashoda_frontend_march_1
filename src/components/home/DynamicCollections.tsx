"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import CollectionCarousel from "./CollectionCarousel";
import { Loader2 } from "lucide-react";

export default function DynamicCollections() {
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await api.getCollections({ isActive: true });
                // Filter collections that actually have products if possible, 
                // but the carousel will hide itself if it has no products anyway.
                setCollections(response.data || []);
            } catch (err) {
                console.error("Failed to fetch collections for home page:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#832729]" />
            </div>
        );
    }

    return (
        <>
            {collections.map((collection, index) => (
                <CollectionCarousel 
                    key={collection.id}
                    collectionSlug={collection.slug}
                    title={collection.name}
                    subtitle={collection.description}
                    // Alternate backgrounds for visual variety
                    bgColor={index % 2 === 0 ? "#fcf8f5" : "#ffffff"}
                />
            ))}
        </>
    );
}
