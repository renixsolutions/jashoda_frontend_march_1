import ProductListing from "@/components/product/ProductListing";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Shop | Jashoda Jewels",
    description: "Explore our exquisite collection of premium silver jewelry.",
};

export default function ShopPage() {
    return (
        <main className="min-h-screen pt-4 pb-8 px-2 md:px-6 bg-white rounded-t-[1rem]">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center p-40">
                    <div className="w-10 h-10 border-2 border-[#702540]/20 border-t-[#702540] rounded-full animate-spin mb-4" />
                    <span className="text-[#702540] font-serif text-xs uppercase tracking-widest animate-pulse">
                        Curating Collection...
                    </span>
                </div>
            }>
                <ProductListing />
            </Suspense>
        </main>
    );
}
