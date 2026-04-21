"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ordersApi } from "@/lib/api";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function InvoicePage() {
    const params = useParams();
    const orderId = params.id;
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await ordersApi.getOrderById(orderId as string);
                if (res.success) {
                    setOrder(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        if (orderId) fetchOrder();
    }, [orderId]);

    if (isLoading) return <div className="p-20 text-center bg-white min-h-screen"><Loader2 className="animate-spin mx-auto w-10 h-10 text-[#1E2856]" /><p className="mt-4 text-gray-500 font-serif">Generating Invoice...</p></div>;
    if (!order) return <div className="p-20 text-center text-red-500 bg-white min-h-screen">Invoice not found.</div>;

    return (
        <div className="min-h-screen bg-white md:bg-gray-100 py-10 print:py-0 print:bg-white">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:rounded-none border border-gray-100 pb-12">
                {/* Print Control Bar */}
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center print:hidden">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Official Invoice</span>
                    <Button onClick={() => window.print()} className="bg-[#1E2856] text-white flex items-center gap-2 px-6">
                        <Printer className="w-4 h-4" /> Print / Download PDF
                    </Button>
                </div>

                {/* Invoice Content */}
                <div id="invoice-container" className="p-12 print:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-16 gap-8">
                        <div className="flex items-start gap-6">
                             <div className="relative w-24 h-24 shrink-0">
                                  <Image 
                                      src="/jashoda-logo.png" 
                                      alt="Jashoda Jewels Logo" 
                                      fill 
                                      className="object-contain"
                                      priority 
                                  />
                             </div>
                             <div>
                                 <h1 className="text-4xl font-serif text-[#1E2856] mb-2 tracking-tight">Jashoda Jewels</h1>
                                 <p className="text-[#F2D7A1] font-medium tracking-[0.2em] text-xs uppercase mb-4">Finest Silver & Luxury Jewellery</p>
                                 <div className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider">
                                     <p> Shop no 1, Chsl, Lt Rd, opposite Miniso, Gyan Nagar, Mhatre Wadi</p>
                                     <p>Borivali West, Mumbai, Maharashtra 400092</p>
                                     <p className="mt-2 text-[#1E2856] font-bold">GSTIN: 23AAAAA0000A1Z5</p>
                                 </div>
                             </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-6xl font-light text-gray-100 uppercase mb-6 tracking-tighter leading-none">INVOICE</h2>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400 uppercase tracking-widest">Order Number</p>
                                <p className="font-bold text-[#1E2856] text-xl"># {order.order_number}</p>
                                <p className="text-xs text-gray-500 mt-4">DATE OF ISSUE</p>
                                <p className="font-medium text-gray-800">{new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-16 px-8 py-10 bg-[#FAFBFF] rounded-3xl print:bg-white print:border print:border-gray-100 print:rounded-none">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1E2856] mb-4 opacity-40">Billed & Shipped To</p>
                            <p className="font-bold text-[#1E2856] text-xl mb-2">{order.shipping_address?.name}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{order.shipping_address?.address}</p>
                            <p className="text-sm text-gray-600">{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</p>
                            <div className="pt-6 flex flex-col gap-1">
                                <p className="text-xs text-gray-400 uppercase tracking-tighter">Contact Details</p>
                                <p className="text-sm text-[#1E2856] font-medium">{order.shipping_address?.phone}</p>
                                {order.user?.email && <p className="text-sm text-gray-500">{order.user.email}</p>}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1E2856] mb-4 opacity-40">Payment Information</p>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Method</p>
                                    <p className="font-bold text-[#1E2856] uppercase tracking-wide">{order.payment_method}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Status</p>
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                        order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {order.payment_status}
                                    </span>
                                </div>
                                {order.razorpay_payment_id && (
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Transaction ID</p>
                                        <p className="text-[10px] font-mono text-gray-500 break-all">{order.razorpay_payment_id}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mb-16">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="py-4 pr-4 text-[#1E2856] font-serif text-sm uppercase tracking-wider">Item Details</th>
                                    <th className="py-4 px-4 text-center text-[#1E2856] font-serif text-sm uppercase tracking-wider">Qty</th>
                                    <th className="py-4 px-4 text-right text-[#1E2856] font-serif text-sm uppercase tracking-wider whitespace-nowrap">Original Price</th>
                                    <th className="py-4 px-4 text-right text-rose-600 font-serif text-sm uppercase tracking-wider whitespace-nowrap">Discount</th>
                                    <th className="py-4 pl-4 text-right text-blue-600 font-serif text-sm uppercase tracking-wider whitespace-nowrap">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items?.map((item: any) => {
                                    const orig = parseFloat(item.original_price || item.price);
                                    const purchasedPrice = parseFloat(item.price);
                                    const qty = item.quantity;
                                    const discountValue = orig > purchasedPrice ? (orig - purchasedPrice) * qty : 0;
                                    
                                    return (
                                    <tr key={item.id} className="group">
                                        <td className="py-6 sm:py-8 pr-4">
                                            <div className="flex items-center gap-4 sm:gap-6">
                                                <div className="w-16 h-16 relative bg-[#FAFBFF] rounded-xl overflow-hidden border border-gray-50 print:block shrink-0 hidden sm:block">
                                                     <Image 
                                                        src={item.image_url || "/diamond-pendant.png"} 
                                                        alt={item.product_name} 
                                                        fill 
                                                        className="object-cover" 
                                                        unoptimized={!!(item.image_url)?.startsWith('http')}
                                                     />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#1E2856] text-base sm:text-lg mb-1">{item.product_name}</p>
                                                    <p className="text-[10px] text-gray-400 font-mono tracking-tighter">SKU: {item.sku || 'N/A'}</p>
                                                    {discountValue > 0 && (
                                                        <span className="inline-block mt-1 px-2 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-bold uppercase tracking-wider rounded">Special Price</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 sm:py-8 px-4 text-center text-gray-600 font-medium">{qty}</td>
                                        <td className="py-6 sm:py-8 px-4 text-right text-gray-500 whitespace-nowrap">
                                            <span className={discountValue > 0 ? "line-through text-gray-400" : ""}>
                                                ₹{(orig * qty).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-6 sm:py-8 px-4 text-right text-rose-600 font-medium whitespace-nowrap">
                                            {discountValue > 0 ? `-₹${discountValue.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="py-6 sm:py-8 pl-4 text-right font-bold text-blue-600 text-lg whitespace-nowrap">₹{(purchasedPrice * qty).toLocaleString()}</td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Notes & Totals */}
                    <div className="flex flex-col md:flex-row justify-between pt-12 border-t-2 border-gray-50 gap-12">
                         {/* Left Side: Notes */}
                         <div className="flex-1 max-w-md">
                             <p className="text-[10px] font-bold uppercase tracking-widest text-[#1E2856] mb-4 opacity-70">Terms & Conditions</p>
                             <ul className="text-xs text-gray-500 space-y-2 list-none">
                                 {/* <li className="flex gap-2"><span className="text-[#F2D7A1]">•</span> Please ensure all payments are made within 7 days of the invoice date.</li> */}
                                 {/* <li className="flex gap-2"><span className="text-[#F2D7A1]">•</span> Jewellery returns are accepted within 14 days with original tags and packaging.</li> */}
                                 <li className="flex gap-2"><span className="text-[#F2D7A1]">•</span> Custom orders are final sale and cannot be returned or exchanged.</li>
                             </ul>
                             
                             <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-[#1E2856] mb-3 opacity-70">Bank Details for Wire Transfer</p>
                                 <div className="grid grid-cols-2 gap-y-2 text-xs">
                                     <p className="text-gray-500 font-medium tracking-wide">Bank:</p>
                                     <p className="text-[#1E2856] font-bold">State Bank of India</p>
                                     <p className="text-gray-500 font-medium tracking-wide">A/C No:</p>
                                     <p className="text-[#1E2856] font-mono font-bold">123456789012345</p>
                                     <p className="text-gray-500 font-medium tracking-wide">IFSC Code:</p>
                                     <p className="text-[#1E2856] font-mono font-bold">SBIN0001234</p>
                                 </div>
                             </div>
                         </div>

                         {/* Right Side: Totals */}
                         <div className="w-full md:w-80 space-y-4 shrink-0">
                             <div className="flex justify-between text-gray-500 px-2">
                                 <span className="text-sm uppercase tracking-widest font-medium">Subtotal</span>
                                 <span className="font-bold">₹{parseFloat(order.subtotal).toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between text-gray-500 px-2">
                                 <span className="text-sm uppercase tracking-widest font-medium">Shipping Fee</span>
                                 <span className="text-green-600 font-bold uppercase text-xs">Complimentary</span>
                             </div>
                             <div className="flex justify-between text-gray-500 px-2">
                                 <span className="text-sm uppercase tracking-widest font-medium">Estimated Taxes</span>
                                 <span className="font-bold">₹{parseFloat(order.tax).toLocaleString()}</span>
                             </div>
                             {parseFloat(order.discount) > 0 && (
                                <div className="flex justify-between text-emerald-600 px-2">
                                    <span className="text-sm uppercase tracking-widest font-medium">Coupon Savings</span>
                                    <span className="font-bold">-₹{parseFloat(order.discount).toLocaleString()}</span>
                                </div>
                             )}
                             <div className="mt-6 p-6 bg-[#1E2856] rounded-2xl flex justify-between items-center text-white shadow-xl shadow-[#1E2856]/20">
                                 <span className="font-serif text-lg tracking-tight">Grand Total</span>
                                 <span className="text-2xl font-bold">₹{parseFloat(order.total).toLocaleString()}</span>
                             </div>
                             <p className="text-[10px] text-gray-400 text-right pr-2 pt-2 uppercase tracking-tighter">All prices are inclusive of GST</p>
                         </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-32 pt-12 border-t border-gray-100">
                        <div className="grid grid-cols-3 gap-8 text-center mb-12">
                            <div>
                                <p className="text-[#1E2856] font-bold text-xs uppercase mb-1 tracking-widest">Authentication</p>
                                {/* <p className="text-[10px] text-gray-400">100% Certified Diamonds</p> */}
                            </div>
                            <div>
                                <p className="text-[#1E2856] font-bold text-xs uppercase mb-1 tracking-widest">Warrantee</p>
                                <p className="text-[10px] text-gray-400">Lifetime Exchange Policy</p>
                            </div>
                            <div>
                                <p className="text-[#1E2856] font-bold text-xs uppercase mb-1 tracking-widest">Secure</p>
                                <p className="text-[10px] text-gray-400">Insured Doorstep Delivery</p>
                            </div>
                        </div>
                        <div className="text-center space-y-4">
                            <p className="text-xs text-gray-300 italic">This is a digitally signed document and does not require a physical signature for validity.</p>
                            <div className="inline-block p-4 bg-gray-50 rounded-full">
                                <p className="text-[#1E2856] font-serif italic text-lg tracking-tighter px-8">Thank you for your patronage</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                @media print {
                    body * { visibility: hidden; }
                    #invoice-container, #invoice-container * { visibility: visible; }
                    #invoice-container { position: absolute; left: 0; top: 0; width: 100%; }
                    @page { margin: 0; }
                    body { background: white !important; margin: 0; padding: 0; }
                    .print-hidden { display: none !important; }
                    .shadow-2xl { box-shadow: none !important; }
                    .rounded-xl, .rounded-3xl, .rounded-2xl { border-radius: 0 !important; }
                    .bg-[#FAFBFF], .bg-[#1E2856] { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}
