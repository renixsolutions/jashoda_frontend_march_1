"use client";

import React, { useState } from "react";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/Button";
import { ChevronRight, ShieldCheck, Truck, CreditCard, CheckCircle2, Map as MapIcon, Loader2, Plus, Home, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const AddressMap = dynamic(() => import('@/components/checkout/AddressMap'), {
    ssr: false,
    loading: () => <div className="w-full h-[300px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-500">Loading Map...</div>
});

type CheckoutStep = 'shipping' | 'payment';

import { ordersApi, usersApi } from "@/lib/api";
import toast from "react-hot-toast";
import { STATE_CITY_MAP } from "@/lib/statesCities";
import { useAuth } from "@/contexts/AuthContext";

export interface Address {
    id: number;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    label?: string;
    is_default?: boolean | number;
}

// Add Razorpay to Window interface
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showMap, setShowMap] = useState(false);

    // Address state
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(true);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    React.useEffect(() => {
        const fetchAddresses = async () => {
            if (!isAuthenticated) return;
            setIsLoadingAddresses(true);
            try {
                const res = await usersApi.getAddresses();
                if (res.success && res.data && res.data.length > 0) {
                    setSavedAddresses(res.data);
                    const defaultAddr = res.data.find((a: any) => a.is_default);
                    if (defaultAddr) {
                        setSelectedAddressId(defaultAddr.id);
                    } else {
                        setSelectedAddressId(res.data[0].id);
                    }
                    setShowNewAddressForm(false);
                }
            } catch (error) {
                console.error("Failed to fetch addresses", error);
            } finally {
                setIsLoadingAddresses(false);
            }
        };
        fetchAddresses();
    }, [isAuthenticated]);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        paymentMethod: 'razorpay'
    });

    if (cartItems.length === 0 && !isProcessing) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-serif text-[#1E2856] mb-4">Your Bag is Empty</h1>
                <p className="text-gray-500 mb-8 max-w-md text-center">Add items to your cart before proceeding to checkout.</p>
                <Link href="/shop">
                    <Button className="bg-[#1E2856] text-white px-8 py-3 rounded-full hover:bg-[#151b3b]">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddressSelect = (data: { address: string; city: string; state: string; pincode: string }) => {
        setFormData(prev => ({
            ...prev,
            address: data.address || prev.address,
            city: data.city || prev.city,
            state: data.state || prev.state,
            pincode: data.pincode || prev.pincode
        }));
        toast.success("Address mapped successfully!");
        setShowMap(false);
    };

    const handleContinueToPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentStep('payment');
        window.scrollTo(0, 0);
    };

    const initializeRazorpay = (orderId: string | number, amount: number, razorpayOrderId: string) => {
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID
            amount: amount * 100, // Amount in paise
            name: "Jashoda Jewellers",
            description: "Order Payment",
            order_id: razorpayOrderId,
            handler: async function (response: any) {
                try {
                    setIsProcessing(true);
                    const verificationResult = await ordersApi.verifyPayment({
                        order_id: orderId,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });

                    if (verificationResult.success) {
                        toast.success("Payment successful!");
                        await clearCart();
                        router.push('/checkout/success');
                    } else {
                        toast.error("Payment verification failed. Please contact support.");
                        setIsProcessing(false);
                    }
                } catch (error: any) {
                    toast.error(error.message || "Failed to verify payment");
                    setIsProcessing(false);
                }
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: "#1E2856"
            }
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', function (response: any) {
            toast.error(response.error.description || "Payment failed!");
            setIsProcessing(false);
        });

        rzp.open();
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // 1. Prepare Order Data
            let shippingAddressData;
            if (!showNewAddressForm && selectedAddressId) {
                const addr = savedAddresses.find(a => a.id === selectedAddressId);
                shippingAddressData = {
                    name: addr?.name,
                    phone: addr?.phone,
                    address: addr?.address,
                    city: addr?.city,
                    state: addr?.state,
                    pincode: addr?.pincode
                };
            } else {
                shippingAddressData = {
                    name: `${formData.firstName} ${formData.lastName}`,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                };

                // Save new address optionally
                if (isAuthenticated) {
                    try {
                        await usersApi.createAddress({
                            ...shippingAddressData,
                            label: "Other"
                        });
                    } catch (err) {
                        console.error("Failed to save new address");
                    }
                }
            }

            const orderData = {
                payment_method: formData.paymentMethod === 'cod' ? 'cod' : 'razorpay',
                shipping_address: shippingAddressData
            };

            // 2. Call API to place order
            const response = await ordersApi.placeOrder(orderData);

            if (response.success) {
                // 3. Handle COD vs Razorpay
                if (orderData.payment_method === 'cod') {
                    toast.success("Order placed successfully!");
                    await clearCart();
                    router.push('/checkout/success');
                } else if (response.data.razorpay_order_id) {
                    // Start Razorpay flow
                    initializeRazorpay(response.data.id, totalPrice, response.data.razorpay_order_id);
                } else {
                    throw new Error("Invalid payment initialization data received.");
                }
            } else {
                throw new Error(response.message || "Failed to place order");
            }

        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Checkout Header Steps */}
                <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/cart" className="hover:text-[#1E2856] transition-colors">Cart</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className={currentStep === 'shipping' ? 'font-medium text-[#1E2856]' : 'cursor-pointer hover:text-[#1E2856]'} onClick={() => setCurrentStep('shipping')}>Shipping</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className={currentStep === 'payment' ? 'font-medium text-[#1E2856]' : ''}>Payment</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Column - Forms */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {currentStep === 'shipping' && (
                                <motion.form
                                    key="shipping"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleContinueToPayment}
                                    className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100"
                                >
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-serif text-[#1E2856] flex items-center gap-2">
                                                <Truck className="w-6 h-6" /> Shipping Information
                                            </h2>
                                            {showNewAddressForm && (
                                                <Button
                                                    type="button"
                                                    onClick={() => setShowMap(!showMap)}
                                                    className="bg-white border border-[#1E2856] text-[#1E2856] hover:bg-[#1E2856]/5 px-4 py-2 flex items-center gap-2 rounded-lg text-sm"
                                                >
                                                    <MapIcon className="w-4 h-4" />
                                                    {showMap ? 'Hide Map' : 'Select on Map'}
                                                </Button>
                                            )}
                                        </div>

                                        {isLoadingAddresses ? (
                                            <div className="flex justify-center py-8">
                                                <Loader2 className="w-8 h-8 animate-spin text-[#1E2856]" />
                                            </div>
                                        ) : (
                                            <>
                                                {savedAddresses.length > 0 && !showNewAddressForm && (
                                                    <div className="space-y-4 mb-6">
                                                        {savedAddresses.map(addr => (
                                                            <div
                                                                key={addr.id}
                                                                className={`border rounded-xl p-4 transition-colors relative ${selectedAddressId === addr.id ? 'border-[#1E2856] bg-[#1E2856]/5' : 'border-gray-200 hover:border-gray-300'}`}
                                                            >
                                                                <div className="flex items-start gap-4">
                                                                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer ${selectedAddressId === addr.id ? 'border-[#1E2856]' : 'border-gray-300'}`} onClick={() => setSelectedAddressId(addr.id)}>
                                                                        {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-[#1E2856]" />}
                                                                    </div>
                                                                    <div className="flex-1 cursor-pointer" onClick={() => setSelectedAddressId(addr.id)}>
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="font-medium text-[#1E2856]">{addr.name}</span>
                                                                            {addr.label && <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{addr.label}</span>}
                                                                            {addr.is_default ? <span className="text-[10px] uppercase font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">Default</span> : null}
                                                                        </div>
                                                                        <p className="text-sm text-gray-600 mb-1">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                                                                        <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
                                                                    </div>
                                                                    <div className="flex flex-col gap-2 shrink-0">
                                                                        {!addr.is_default && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={async (e) => {
                                                                                    e.stopPropagation();
                                                                                    try {
                                                                                        await usersApi.setDefaultAddress(addr.id);
                                                                                        toast.success("Default address updated");
                                                                                        // Refresh addresses
                                                                                        const res = await usersApi.getAddresses();
                                                                                        if (res.success) setSavedAddresses(res.data);
                                                                                    } catch (err: any) {
                                                                                        toast.error(err.message || "Failed to set default");
                                                                                    }
                                                                                }}
                                                                                className="text-xs text-[#1E2856] hover:underline flex items-center gap-1"
                                                                            >
                                                                                Set as Default
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            type="button"
                                                                            onClick={async (e) => {
                                                                                e.stopPropagation();
                                                                                if (!confirm('Are you sure you want to delete this address?')) return;
                                                                                try {
                                                                                    await usersApi.deleteAddress(addr.id);
                                                                                    toast.success("Address deleted");
                                                                                    // Refresh addresses
                                                                                    const res = await usersApi.getAddresses();
                                                                                    if (res.success) {
                                                                                        setSavedAddresses(res.data);
                                                                                        if (selectedAddressId === addr.id) {
                                                                                            setSelectedAddressId(res.data.length > 0 ? res.data[0].id : null);
                                                                                            if (res.data.length === 0) setShowNewAddressForm(true);
                                                                                        }
                                                                                    }
                                                                                } catch (err: any) {
                                                                                    toast.error(err.message || "Failed to delete address");
                                                                                }
                                                                            }}
                                                                            className="text-xs text-red-600 hover:underline flex items-center gap-1"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <Button
                                                            type="button"
                                                            onClick={() => setShowNewAddressForm(true)}
                                                            className="w-full py-4 bg-white border border-dashed border-[#1E2856] text-[#1E2856] rounded-xl hover:bg-[#1E2856]/5 font-medium transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <Plus className="w-4 h-4" /> Add New Address
                                                        </Button>
                                                    </div>
                                                )}

                                                {showNewAddressForm && (
                                                    <div className="space-y-6">
                                                        {savedAddresses.length > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowNewAddressForm(false);
                                                                    setShowMap(false);
                                                                }}
                                                                className="text-sm text-[#1E2856] font-medium hover:underline mb-2 block"
                                                            >
                                                                &larr; Back to saved addresses
                                                            </button>
                                                        )}

                                                        <AnimatePresence>
                                                            {showMap && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                                                        <h3 className="text-sm font-medium text-[#1E2856] mb-3">Pin your location</h3>
                                                                        <div className="h-[400px]">
                                                                            <AddressMap onAddressSelect={handleAddressSelect} />
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1E2856]" placeholder="john@example.com" />
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1E2856]" placeholder="John" />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                                                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1E2856]" placeholder="Doe" />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                                <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1E2856]" placeholder="123 Main St, Apt 4B" />
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div className="md:col-span-1">
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                                                    <select required name="state" value={formData.state} onChange={(e) => {
                                                                        handleChange(e);
                                                                        setFormData(prev => ({ ...prev, city: '' })); // Reset city when state changes
                                                                    }} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1E2856] bg-white">
                                                                        <option value="">Select State</option>
                                                                        {Object.keys(STATE_CITY_MAP).sort().map(stateName => (
                                                                            <option key={stateName} value={stateName}>{stateName}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="md:col-span-1">
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                                    <select
                                                                        required
                                                                        name="city"
                                                                        value={formData.city}
                                                                        onChange={handleChange}
                                                                        disabled={!formData.state}
                                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1E2856] bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                                                    >
                                                                        <option value="">Select City</option>
                                                                        {formData.state && STATE_CITY_MAP[formData.state]?.sort().map(cityName => (
                                                                            <option key={cityName} value={cityName}>{cityName}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div className="md:col-span-1">
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                                                                    <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1E2856]" placeholder="400001" />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1E2856]" placeholder="+91 98765 43210" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <Button type="submit" className="w-full py-4 bg-[#1E2856] text-white rounded-lg hover:bg-[#151b3b] font-medium text-lg flex items-center justify-center gap-2">
                                        Continue to Payment <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </motion.form>
                            )}

                            {currentStep === 'payment' && (
                                <motion.form
                                    key="payment"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handlePlaceOrder}
                                    className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100"
                                >
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-serif text-[#1E2856] mb-6 flex items-center gap-2">
                                            <CreditCard className="w-6 h-6" /> Payment Method
                                        </h2>

                                        <div className="space-y-4">
                                            <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'razorpay' ? 'border-[#1E2856] bg-[#1E2856]/5' : 'border-gray-200'}`} onClick={() => setFormData({ ...formData, paymentMethod: 'razorpay' })}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'razorpay' ? 'border-[#1E2856]' : 'border-gray-300'}`}>
                                                            {formData.paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-[#1E2856]" />}
                                                        </div>
                                                        <span className="font-medium text-[#1E2856]">Pay Online (Razorpay)</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {/* Simple mock card icons */}
                                                        <div className="w-8 h-5 bg-blue-100 rounded text-[10px] flex items-center justify-center text-blue-800 font-bold">UPI</div>
                                                        <div className="w-8 h-5 bg-orange-100 rounded text-[10px] flex items-center justify-center text-orange-800 font-bold">CARD</div>
                                                    </div>
                                                </div>
                                                <AnimatePresence>
                                                    {formData.paymentMethod === 'razorpay' && (
                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-3 pb-1">
                                                            <p className="text-sm text-gray-500">You will be redirected to Razorpay to complete your payment securely via UPI, Credit/Debit Card, or Netbanking.</p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-[#1E2856] bg-[#1E2856]/5' : 'border-gray-200'}`} onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-[#1E2856]' : 'border-gray-300'}`}>
                                                        {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#1E2856]" />}
                                                    </div>
                                                    <span className="font-medium text-[#1E2856]">Cash on Delivery</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-[#1E2856]">Secure SSL Checkout</p>
                                                <p className="text-xs text-gray-500">Your connection is encrypted and your payment details are safe.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button type="button" onClick={() => setCurrentStep('shipping')} className="flex-1 py-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-lg">
                                                Back
                                            </Button>
                                            <Button type="submit" disabled={isProcessing} className="flex-[2] py-4 bg-[#1E2856] text-white rounded-lg hover:bg-[#151b3b] font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                                {isProcessing ? (
                                                    <span className="flex items-center gap-2">
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </span>
                                                ) : "Pay ₹" + totalPrice.toLocaleString()}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-[420px] shrink-0">
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 sticky top-32">
                            <h2 className="text-xl font-serif text-[#1E2856] mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                            <Image
                                                src={item.images ? item.images[0] : ("/images/placeholder.png")}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <span className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-[#1E2856] truncate pr-4">{item.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{item.metalType || "Silver"}{item.size ? ` • ${item.size}` : ''}</p>
                                        </div>
                                        <div className="text-right shrink-0 flex flex-col items-end">
                                            <span className="text-sm font-bold text-[#1E2856]">₹{((item.discount_price ? Number(item.discount_price) : item.price) * item.quantity).toLocaleString()}</span>
                                            {item.discount_price && Number(item.discount_price) < item.price && (
                                                <span className="text-xs text-gray-400 line-through">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax (Included)</span>
                                    <span>₹0</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mt-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-base font-medium text-[#1E2856]">Total</span>
                                    <span className="text-3xl font-bold text-[#1E2856] font-serif">₹{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
            `}</style>
        </div>
    );
}
