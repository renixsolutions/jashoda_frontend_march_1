import React from "react";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>

                <h1 className="text-3xl font-serif text-[#1E2856] mb-2">Order Confirmed!</h1>
                <p className="text-gray-500 mb-8">
                    Thank you for your purchase. We've sent a confirmation email with your order details.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100">
                    <div className="flex items-center gap-3 text-[#1E2856] font-medium mb-4 pb-4 border-b border-gray-200">
                        <Package className="w-5 h-5" /> Order Information
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Order Number</span>
                            <span className="font-medium text-[#1E2856]">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Date</span>
                            <span className="font-medium text-[#1E2856]">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className="font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs">Processing</span>
                        </div>
                    </div>
                </div>

                <Link href="/shop" className="block w-full">
                    <Button className="w-full py-4 bg-[#1E2856] text-white rounded-lg hover:bg-[#151b3b] font-medium text-lg flex items-center justify-center gap-2">
                        Continue Shopping <ArrowRight className="w-5 h-5" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
