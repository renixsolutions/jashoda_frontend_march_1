import ProductListing from "@/components/product/ProductListing";
import { Metadata } from "next";

import { Suspense } from "react";
import GlobalBreadcrumb from "@/components/layout/GlobalBreadcrumb";

export const metadata: Metadata = {
    title: "Shop | Jashoda Jewels",
    description: "Explore our exquisite collection of premium silver jewelry.",
};

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-white">
            <GlobalBreadcrumb />
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center p-40">
                    <div className="w-10 h-10 border-2 border-[#111827]/20 border-t-[#111827] rounded-full animate-spin mb-4" />
                    <span className="text-[#111827] font-serif text-xs uppercase tracking-widest animate-pulse">
                        Curating Collection...
                    </span>
                </div>
            }>
                <ProductListing />
            </Suspense>
        </main>
    );
}
