"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, ArrowRight, Clock, CheckCircle2, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { ordersApi } from "@/lib/api";
import toast from "react-hot-toast";

// Define mock order data structure
interface OrderItem {
    id?: string | number;
    product_id?: string | number;
    name?: string;
    image?: string;
    quantity?: number;
    price?: number;
}

export interface Order {
    id: string | number;
    created_at?: string;
    date?: string; // fallback
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
    items: OrderItem[];
}

export default function OrdersPage() {
    const { isAuthenticated, user } = useAuth();
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    // Fallback UI for authenticated state since mock AuthContext might not persist on direct URL loads
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    React.useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) return;

            try {
                setIsLoading(true);
                const response = await ordersApi.getOrders();
                if (response.success && response.data) {
                    // Filter out pending (unpaid) orders so only successful ones show up
                    const paidOrders = response.data.filter((order: Order) => order.status !== 'pending');
                    setOrders(paidOrders);
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to fetch orders");
            } finally {
                setIsLoading(false);
            }
        };

        if (isClient && isAuthenticated) {
            fetchOrders();
        }
    }, [isClient, isAuthenticated]);

    if (!isClient) return null; // Avoid hydration mismatch

    if (!isAuthenticated) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-3xl font-serif text-[#1E2856] mb-4">View Your Orders</h1>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    Please log in to view your order history and tracking information.
                </p>
                <Button
                    onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).openAuthModal) {
                            (window as any).openAuthModal();
                        }
                    }}
                    className="bg-[#1E2856] text-white px-8 py-3 rounded-full hover:bg-[#151b3b]"
                >
                    Log In / Sign Up
                </Button>
            </div>
        );
    }

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'processing': return <Clock className="w-4 h-4 text-amber-500" />;
            case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
            case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            default: return null;
        }
    };

    const getStatusText = (status: Order['status']) => {
        switch (status) {
            case 'processing': return 'Processing';
            case 'shipped': return 'Shipped';
            case 'delivered': return 'Delivered';
            default: return 'Unknown';
        }
    };

    return (
        <div className="min-h-screen pt-8 md:pt-12 pb-24 bg-[#FAFAFA] px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-serif text-[#1E2856] mb-2">My Orders</h1>
                        <p className="text-gray-500">View and track your previous purchases</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#1E2856] animate-spin mb-4" />
                        <p className="text-gray-500">Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 flex flex-col items-center">
                        <Package className="w-16 h-16 text-gray-300 mb-6" />
                        <h2 className="text-2xl font-serif text-[#1E2856] mb-3">No Orders Yet</h2>
                        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't made any purchases yet. Start exploring our collection to find something you love.</p>
                        <Link href="/shop">
                            <Button className="bg-[#1E2856] text-white px-8 py-3 rounded-full hover:bg-[#151b3b]">
                                Browse Collection
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                        className="space-y-6"
                    >
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white border text-sm border-gray-100 rounded-2xl overflow-hidden mb-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[#1E2856]/20 group/card"
                            >
                                {/* Order Header */}
                                <div className="bg-[#FAFAFB] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                                    <div className="flex flex-wrap items-center gap-x-12 gap-y-2">
                                        <div>
                                            <p className="text-gray-500 font-medium mb-1">Order Placed</p>
                                            <p className="text-[#1E2856] font-semibold">
                                                {new Date(order.created_at || order.date || new Date()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium mb-1">Total</p>
                                            <p className="text-[#1E2856] font-semibold">₹{(order.total_amount || 0).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-medium mb-1">Ship To</p>
                                            <p className="text-blue-600 hover:underline cursor-pointer">{user?.name || "Customer"}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:items-end">
                                        <p className="text-gray-500 font-medium mb-1">Order # {order.id}</p>
                                        <Link href={`#`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium group/link">
                                            View Details <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div className="p-6">
                                    <div className="mb-6">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide bg-transparent ${order.status === 'processing' ? 'text-amber-600 border-amber-200' : order.status === 'shipped' ? 'text-blue-600 border-blue-200' : 'text-green-600 border-green-200'}`}>
                                            {getStatusIcon(order.status)}
                                            {getStatusText(order.status)}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {(order.items || []).map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-6">
                                                <div className="flex flex-1 items-start gap-6">
                                                    <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-50">
                                                        <Image
                                                            src={item.image || "/images/placeholder.png"}
                                                            alt={item.name || "Product Image"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-center min-w-0 pt-2">
                                                        <h3 className="text-base font-medium text-[#1E2856] mb-1">{item.name || "Jewellery Item"}</h3>
                                                        <div className="text-gray-500 space-y-1">
                                                            <p>Qty: {item.quantity}</p>
                                                            <p className="text-[#1E2856] font-medium">₹{(item.price || 0).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-3 shrink-0 sm:w-40">
                                                    <Button className="w-full py-2 text-sm font-medium bg-white border border-[#1E2856] text-[#1E2856] hover:bg-[#1E2856] hover:text-white rounded-lg transition-colors duration-300">
                                                        Track Package
                                                    </Button>
                                                    <Button className="w-full py-2 text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-300 shadow-sm">
                                                        Ask Question
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
