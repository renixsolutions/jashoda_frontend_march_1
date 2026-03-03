import ProductListing from "@/components/product/ProductListing";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Shop | Jashoda Jewels",
    description: "Explore our exquisite collection of premium silver jewelry.",
};

export default function ShopPage() {
    return (
        <main>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-20 text-[#832729]">Loading...</div>}>
                <ProductListing />
            </Suspense>
        </main>
    );
}
