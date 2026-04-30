import React from "react";
import { Star } from "lucide-react";
import { Product } from "@/lib/mockData";

export default function PDPInfo({ product }: { product: Product }) {
    return (
        <div className="flex flex-col gap-6 text-[#1E2856]"> {/* Dark Blue/Charcoal Text */}
            {/* ... (Header section unchanged) ... */}
            <div>
                <h1 className="text-4xl md:text-5xl font-serif font-medium mb-2">
                    {product.name}
                </h1>
                <div className="flex items-center gap-4 text-sm mb-4">
                    {product.rating && (
                        <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-0.5 rounded">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{product.rating}</span>
                        </div>
                    )}
                    {product.reviewCount && (
                        <span className="text-gray-500 border-r border-gray-300 pr-4">{product.reviewCount} Reviews</span>
                    )}
                    <span className="text-[#1E2856] font-semibold tracking-wide uppercase">
                        {product.purity ? `${product.purity} ` : ''}{product.metal_type || product.metalType || 'Silver'}
                    </span>
                </div>

                <div className="flex items-baseline gap-4 mt-4">
                    <span className="text-4xl font-bold">₹{(product.discount_price ? Number(product.discount_price) : Number(product.price)).toLocaleString()}</span>
                    {product.discount_price && (
                        <>
                            <span className="text-xl text-gray-400 line-through">₹{Number(product.price).toLocaleString()}</span>
                            <span className="text-red-500 font-medium">
                                ({Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)}% OFF)
                            </span>
                        </>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">MRP inclusive of all taxes. Free shipping on this item.</p>

                {/* Stock Indicator */}
                <div className="mt-4">
                    {product.stock_quantity !== undefined && product.stock_quantity > 0 ? (
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 5 ? 'bg-green-500' : 'bg-orange-500'}`} />
                                <span className={`text-sm font-medium ${product.stock_quantity > 5 ? 'text-green-700' : 'text-orange-700'}`}>
                                    {product.stock_quantity > 5 ? 'In Stock' : `Only ${product.stock_quantity} left in stock!`}
                                </span>
                            </div>
                            {product.stock_quantity <= 10 && (
                                <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${product.stock_quantity > 5 ? 'bg-green-500' : 'bg-orange-500'}`} 
                                        style={{ width: `${(product.stock_quantity / 10) * 100}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-sm font-medium text-red-700 uppercase tracking-wider">Out of Stock</span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
