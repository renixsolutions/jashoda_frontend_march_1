import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import PDPGallery from "@/components/product/PDPGallery";
import PDPInfo from "@/components/product/PDPInfo";
import PDPTabs from "@/components/product/PDPTabs";
import PDPRelated from "@/components/product/PDPRelated";

export const metadata: Metadata = {
    title: "Classic Silver Solitaire Ring | Jashoda Jewels",
    description: "Shop the Classic Silver Solitaire Ring.",
};

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // In server components starting Next 13+ (and strictly 15+), params should be handled carefully
    const { id } = await params;

    // We are using a client side fetching approach inside a server component? 
    // Actually, we can fetch directly here if we make it an async component (which it is).
    // But our API lib uses `fetch` with caching options.
    // Note: Calling localhost API routes from Server Components during build time might be tricky if not running.
    // However, usually we can use the service directly or just standard fetch.

    // Fetch data
    let product = null;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/products/${id}`, { cache: 'no-store' });
        if (res.ok) {
            const json = await res.json();
            product = json.data;
        }
    } catch (e) {
        console.error(e);
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
    }

    return (
        <div className="bg-white min-h-screen">
            {/* 
              Forcing a light theme Navbar or just assuming existing one works/adapts.
              Since existing Navbar might be transparent/dark, we might need a container or prop to force it dark-text.
              For now, I'll wrap the page content.
              If the global Navbar is fixed, we might need to adjust margin.
            */}

            {/* Main Content */}
            <main className="pt-8 pb-16 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
                    <div className="w-full">
                        <PDPGallery images={product.images || []} />
                    </div>
                    <div className="w-full">
                        <PDPInfo product={product} />
                        <PDPTabs />
                    </div>
                </div>

                <PDPRelated />
            </main>
        </div>
    );
}
