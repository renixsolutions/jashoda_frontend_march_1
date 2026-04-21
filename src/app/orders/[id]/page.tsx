"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
    ChevronLeft, 
    Package, 
    Truck, 
    CheckCircle2, 
    Clock, 
    MapPin, 
    CreditCard, 
    ArrowLeft,
    Phone,
    Mail,
    Calendar,
    Hash,
    Loader2
} from "lucide-react";
import { ordersApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id;
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await ordersApi.getOrderById(orderId as string);
                if (res.success) {
                    setOrder(res.data);
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to fetch order details");
                router.push('/orders');
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) fetchOrderDetails();
    }, [orderId, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-[#1E2856] animate-spin mb-4" />
                <p className="text-gray-500 font-serif">Loading order details...</p>
            </div>
        );
    }

    if (!order) return null;

    const getStatusStep = (status: string) => {
        const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        return steps.indexOf(status);
    };

    const currentStep = getStatusStep(order.status);

    return (
        <div className="min-h-screen pt-12 pb-24 bg-[#FAFAFA]">
            <div className="max-w-5xl mx-auto px-4">
                {/* Back Button */}
                <Link 
                    href="/orders" 
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E2856] transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to My Orders
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-3xl font-serif text-[#1E2856]">Order Details</h1>
                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                 order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                 order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                 'bg-blue-50 text-blue-700 border-blue-200'
                             }`}>
                                 {order.status}
                             </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5"><Hash className="w-4 h-4" /> {order.order_number}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(order.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/orders/${order.id}/invoice`} target="_blank">
                            <Button className="bg-white border border-[#1E2856] text-[#1E2856] hover:bg-[#1E2856]/5">
                                Download Invoice
                            </Button>
                        </Link>
                        <Button className="bg-[#1E2856] text-white hover:bg-[#151b3b]">
                            Support
                        </Button>
                    </div>
                </div>

                {/* Status Tracker */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <div className="relative flex justify-between">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-0" />
                        <div 
                            className="absolute top-5 left-0 h-0.5 bg-[#1E2856] transition-all duration-1000 -z-0" 
                            style={{ width: `${Math.max(0, (currentStep / 4) * 100)}%` }}
                        />

                        {[
                            { label: 'Pending', icon: Clock },
                            { label: 'Confirmed', icon: CheckCircle2 },
                            { label: 'Processing', icon: Package },
                            { label: 'Shipped', icon: Truck },
                            { label: 'Delivered', icon: CheckCircle2 }
                        ].map((step, idx) => {
                            const Icon = step.icon;
                            const isActive = idx <= currentStep;
                            const isCurrent = idx === currentStep;

                            return (
                                <div key={step.label} className="flex flex-col items-center relative z-10 w-20 text-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                                        isCurrent ? 'bg-[#1E2856] border-[#1E2856] text-white' :
                                        isActive ? 'bg-white border-[#1E2856] text-[#1E2856]' :
                                        'bg-white border-gray-100 text-gray-300'
                                    }`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`mt-3 text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-[#1E2856]' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Items & Payment */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-[#FAFAFB]">
                                <h3 className="font-serif text-[#1E2856]">Items Ordered</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.items?.map((item: any) => (
                                    <div key={item.id} className="p-6 flex gap-6">
                                        <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                            <Image 
                                                src={item.image || item.image_url || "/diamond-pendant.png"} 
                                                alt={item.product_name} 
                                                fill 
                                                className="object-cover"
                                                unoptimized={!!(item.image || item.image_url)?.startsWith('http')}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="text-lg font-medium text-[#1E2856] mb-1">{item.product_name}</h4>
                                            <p className="text-sm text-gray-500 mb-2">SKU: {item.sku || 'N/A'}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-gray-600">Qty: {item.quantity}</span>
                                                <span className="font-bold text-[#1E2856]">₹{parseFloat(item.price).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Calculation */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                             <div className="space-y-4">
                                 <div className="flex justify-between text-gray-600">
                                     <span>Subtotal</span>
                                     <span>₹{parseFloat(order.subtotal).toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between text-gray-600">
                                     <span>Shipping</span>
                                     <span className="text-green-600">Free</span>
                                 </div>
                                 {parseFloat(order.discount) > 0 && (
                                     <div className="flex justify-between text-rose-600">
                                         <span>Discount</span>
                                         <span>-₹{parseFloat(order.discount).toLocaleString()}</span>
                                     </div>
                                 )}
                                 <div className="flex justify-between text-gray-600">
                                     <span>Tax (Included)</span>
                                     <span>₹{parseFloat(order.tax).toLocaleString()}</span>
                                 </div>
                                 <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                     <span className="text-xl font-serif text-[#1E2856]">Grand Total</span>
                                     <span className="text-3xl font-bold text-[#1E2856] font-serif">₹{parseFloat(order.total).toLocaleString()}</span>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Right: Shipping & Info */}
                    <div className="space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-serif text-[#1E2856] mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" /> Shipping Address
                            </h3>
                            <div className="text-sm space-y-2 text-gray-600">
                                <p className="font-bold text-[#1E2856] text-base">{order.shipping_address?.name}</p>
                                <p>{order.shipping_address?.address}</p>
                                <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
                                <div className="pt-4 flex flex-col gap-2">
                                    <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {order.shipping_address?.phone}</span>
                                    {order.user?.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {order.user.email}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-serif text-[#1E2856] mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" /> Payment Method
                            </h3>
                            <div className="text-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Method</span>
                                    <span className="font-medium text-[#1E2856] uppercase">{order.payment_method}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Status</span>
                                    <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                                        order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {order.payment_status}
                                    </span>
                                </div>
                                {order.razorpay_payment_id && (
                                    <div className="flex flex-col gap-1 pt-2">
                                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Transaction ID</span>
                                        <span className="text-xs font-mono text-gray-500 truncate">{order.razorpay_payment_id}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#1E2856] p-6 rounded-2xl shadow-lg text-white">
                            <h3 className="font-serif text-lg mb-2">Need Assistance?</h3>
                            <p className="text-xs text-white/70 mb-6">Our jewelry experts are here to help you with any questions regarding your order.</p>
                            <Button className="w-full bg-[#F2D7A1] text-[#1E2856] hover:bg-white border-none font-bold">
                                Contact Expert
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
