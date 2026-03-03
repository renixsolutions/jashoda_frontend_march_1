import ProductViewer from "@/components/product/ProductViewer";
import ProductInfo from "@/components/product/ProductInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Details | Jashoda Jewels", // dynamic in real app
    description: "View product details.",
};

export default function ProductPage({ params }: { params: { slug: string } }) {
    return (
        <main className="min-h-screen pt-32 pb-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Left: 3D Viewer */}
                <div className="w-full sticky top-32 self-start">
                    <ProductViewer />
                </div>

                {/* Right: Product Details */}
                <div>
                    <ProductInfo />
                </div>
            </div>

            {/* Similar Products or Reviews Section could go here */}
            <div className="h-24" />
        </main>
    );
}
