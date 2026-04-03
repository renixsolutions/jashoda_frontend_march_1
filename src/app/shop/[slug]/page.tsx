import ProductViewer from "@/components/product/ProductViewer";
import ProductInfo from "@/components/product/ProductInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product Details | Jashoda Jewels", // dynamic in real app
    description: "View product details.",
};

export default function ProductPage({ params }: { params: { slug: string } }) {
    return (
        <main className="min-h-screen pt-4 pb-8 px-2 md:px-6 bg-white rounded-t-[2.5rem] shadow-sm -mt-4 relative z-10">
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
