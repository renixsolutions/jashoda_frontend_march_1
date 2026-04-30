import React from "react";
import { Metadata } from "next";
import PDPGallery from "@/components/product/PDPGallery";
import PDPInfo from "@/components/product/PDPInfo";
import PDPTabs from "@/components/product/PDPTabs";
import PDPActions from "@/components/product/PDPActions";
import PDPRelated from "@/components/product/PDPRelated";
import GlobalBreadcrumb from "@/components/layout/GlobalBreadcrumb";
import ReviewSection from "@/components/product/ReviewSection";

export const metadata: Metadata = {
    title: "Product Details | Jashoda Jewels",
    description: "View product details and explore our collection.",
};

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch data
    let product = null;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/products/${id}`, { cache: 'no-store' });
        if (res.ok) {
            const json = await res.json();
            product = json.data;
        }
    } catch (e) {
        console.error("Failed to fetch product for shop detail page:", e);
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-20 text-center">
                <h2 className="text-2xl font-serif text-[#702540] mb-4">Product Not Found</h2>
                <p className="text-gray-500 mb-8">We couldn't find the product you're looking for.</p>
                <a href="/shop" className="px-8 py-3 bg-[#702540] text-white rounded-full font-bold uppercase tracking-widest text-xs">
                    Return to Shop
                </a>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Main Content */}
            <main className="pt-4 md:pt-8 pb-16 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
                <GlobalBreadcrumb />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 mt-4">
                    <div className="w-full">
                        <PDPGallery 
                            images={product.images || []} 
                            videoUrl={product.video_url}
                            rating={product.average_rating} 
                            reviews={product.review_count} 
                        />
                    </div>
                    <div className="w-full">
                        <PDPInfo product={product} />
                        <PDPTabs product={product} />
                        <PDPActions product={product} />
                    </div>
                </div>

                <div className="mb-20">
                    <ReviewSection productId={product.id} horizontal={true} />
                </div>

                <PDPRelated currentProduct={product} />
            </main>
        </div>
    );
}
