"use client";

import React from "react";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { PRODUCTS as MOCK_PRODUCTS, Product } from "@/lib/mockData";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { api, getMediaUrl } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PDPRelatedProps {
    currentProduct: Product;
}

export default function PDPRelated({ currentProduct }: PDPRelatedProps) {
    const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const router = useRouter();

    React.useEffect(() => {
        const fetchRelated = async () => {
            setLoading(true);
            try {
                const catId = currentProduct.categoryId || (currentProduct as any).category;
                const subId = currentProduct.subcategoryId || (currentProduct as any).subcategory;
                const gender = (currentProduct as any).gender;

                let results: Product[] = [];
                
                // Helper to add products to results uniquely
                const addUniqueProducts = (newProducts: Product[]) => {
                    const filtered = newProducts.filter(p => 
                        String(p.id) !== String(currentProduct.id) && 
                        !results.some(r => String(r.id) === String(p.id))
                    );
                    results = [...results, ...filtered];
                };

                // Priority 1: Same subcategory + Same Gender
                if (subId && gender) {
                    const res = await api.getProducts({ 
                        subcategory: String(subId),
                        gender: String(gender),
                        limit: 5 
                    });
                    if (res.success) addUniqueProducts(res.data);
                }
                
                // Priority 2: Same subcategory (any gender)
                if (results.length < 4 && subId) {
                    const res = await api.getProducts({ 
                        subcategory: String(subId),
                        limit: 5 
                    });
                    if (res.success) addUniqueProducts(res.data);
                }

                // Priority 3: Same category + Same Gender
                if (results.length < 4 && catId && gender) {
                    const res = await api.getProducts({ 
                        category: String(catId),
                        gender: String(gender),
                        limit: 5 
                    });
                    if (res.success) addUniqueProducts(res.data);
                }
                
                // Priority 4: Same category (any gender)
                if (results.length < 4 && catId) {
                    const res = await api.getProducts({ 
                        category: String(catId),
                        limit: 10 
                    });
                    if (res.success) addUniqueProducts(res.data);
                }
                
                setRelatedProducts(results.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch related products:", error);
                setRelatedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [currentProduct.id, (currentProduct as any).categoryId, (currentProduct as any).category, (currentProduct as any).subcategoryId, (currentProduct as any).subcategory, (currentProduct as any).gender]);

    if (!loading && relatedProducts.length === 0) return null;

    return (
        <div className="py-16">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-serif text-[#1E2856]">You May Also Like</h2>
                <Link 
                    href={`/shop?category=${currentProduct.categoryId}`}
                    className="text-xs font-bold text-gray-400 tracking-widest hover:text-[#1E2856] uppercase flex items-center gap-1"
                >
                    View All <span className="text-lg">→</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-100 aspect-square mb-4 rounded-lg"></div>
                            <div className="h-4 bg-gray-100 w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-100 w-1/2"></div>
                        </div>
                    ))
                ) : (
                    relatedProducts.map((product) => {
                        const discount = product.originalPrice 
                            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                            : 0;

                        return (
                            <div 
                                key={product.id} 
                                className="group cursor-pointer"
                                onClick={() => {
                                    router.push(`/product/${product.id}`);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                <div className="relative aspect-square mb-4 bg-[#F5F5F5] overflow-hidden rounded-xl border border-gray-50">
                                    {/* Tag */}
                                    {product.badge && (
                                        <span className={`absolute top-3 left-3 bg-[#1E2856] text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest z-10 rounded-full`}>
                                            {product.badge}
                                        </span>
                                    )}

                                    {/* Wishlist */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isInWishlist(product.id)) {
                                                removeFromWishlist(product.id);
                                            } else {
                                                addToWishlist(product);
                                            }
                                        }}
                                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white z-10 transition-all border border-gray-100 shadow-sm"
                                    >
                                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`} />
                                    </button>

                                    <Image
                                        src={getMediaUrl(product.image_url || product.images[0])}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/diamond-pendant.png';
                                        }}
                                    />

                                    {/* Add to Cart Overlay */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product);
                                        }}
                                        className="absolute bottom-0 left-0 w-full bg-white/95 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-center gap-2 text-[#1E2856] text-[10px] font-bold tracking-[0.2em] uppercase border-t border-gray-100 hover:bg-[#1E2856] hover:text-white z-20"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        ADD TO CART
                                    </button>
                                </div>

                                <div className="px-1">
                                    <div className="flex items-center gap-1 mb-1.5">
                                        <StarRating rating={product.rating || 5.0} />
                                    </div>

                                    <h3 className="text-[#1E2856] font-semibold text-sm mb-1.5 group-hover:text-blue-900 transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#1E2856]">₹{Number(product.price).toLocaleString()}</span>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <>
                                                <span className="text-[10px] text-gray-400 line-through tracking-wider">₹{Number(product.originalPrice).toLocaleString()}</span>
                                                <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">({discount}% OFF)</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-[10px] ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400">{rating}</span>
        </div>
    )
}
