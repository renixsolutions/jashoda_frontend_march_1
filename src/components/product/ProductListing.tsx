"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import FilterTopBar from "./FilterTopBar";
import AdvertisingBanner from "./AdvertisingBanner";
import ChooseLook from "./ChooseLook";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Product } from "@/lib/mockData";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

// Animation Variants
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function ProductListing() {
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get('category') || undefined;
    const subcategoryQuery = searchParams.get('subcategory') || undefined;
    const occasionQuery = searchParams.get('occasion') || undefined;
    const genderQuery = searchParams.get('gender') || undefined;
    const minPriceQuery = searchParams.get('min') ? Number(searchParams.get('min')) : undefined;
    const maxPriceQuery = searchParams.get('max') ? Number(searchParams.get('max')) : undefined;
    const searchStr = searchParams.get('search') || undefined;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Reset pagination and products when filters change
    useEffect(() => {
        setPage(1);
        setProducts([]);
        setHasMore(true);
    }, [categoryQuery, subcategoryQuery, occasionQuery, genderQuery, minPriceQuery, maxPriceQuery, searchStr]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await api.getProducts({
                    page,
                    limit: 20,
                    category: categoryQuery,
                    subcategory: subcategoryQuery,
                    occasion: occasionQuery,
                    gender: genderQuery,
                    search: searchStr,
                    // minPrice: minPriceQuery,
                    // maxPrice: maxPriceQuery
                });
                if (response.success) {
                    if (page === 1) {
                        setProducts(response.data);
                    } else {
                        setProducts(prev => [...prev, ...response.data]);
                    }

                    if (response.meta?.pagination) {
                        setHasMore(page < response.meta.pagination.totalPages);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, categoryQuery, subcategoryQuery, occasionQuery, genderQuery, searchStr]);

    const loadMore = () => {
        if (hasMore) {
            setPage(prev => prev + 1);
        }
    };

    // Group products by category for display
    const rings = products.filter(p => p.category === "Rings");
    const otherProducts = products.filter(p => p.category !== "Rings");
    const earrings = otherProducts.filter(p => p.category === "Earrings");
    const remaining = otherProducts.filter(p => p.category !== "Earrings");

    if (loading && page === 1) {
        return <div className="min-h-screen flex items-center justify-center p-20 text-[#832729]">Loading...</div>;
    }

    return (
        <div className="min-h-screen pt-8 pb-24 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif text-[#832729] mb-2">
                            All Jewellery <span className="text-lg text-[#832729]/60 align-middle ml-2 font-sans font-normal">({products.length} results)</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 text-[#832729]/80 text-sm">
                        <span>Sort By:</span>
                        <select className="bg-white text-[#404040] border border-[#832729]/20 rounded-full px-4 py-2 text-sm focus:outline-none cursor-pointer hover:border-[#832729]/50 transition-colors">
                            <option value="featured">Best Matches</option>
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </motion.div>

                {/* Top Filters */}
                <FilterTopBar />

                {/* Section 1: Rings */}
                {rings.length > 0 && (
                    <div className="mb-16">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {rings.map((product) => (
                                <motion.div key={product.id} variants={item}>
                                    <ProductCard product={{ ...product, image: product.images?.[0] || '/images/placeholder.jpg' }} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}
                {/* Advertising Banner */}
                <AdvertisingBanner />

                {/* Section 2: Earrings */}
                {earrings.length > 0 && (
                    <div className="mb-16">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {earrings.map((product) => (
                                <motion.div key={product.id} variants={item}>
                                    <ProductCard product={{ ...product, image: product.images?.[0] || '/images/placeholder.jpg' }} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}



                {/* Section 3: Remaining Items */}
                {remaining.length > 0 && (
                    <div>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {remaining.map((product) => (
                                <motion.div key={product.id} variants={item}>
                                    <ProductCard product={{ ...product, image: product.images?.[0] || '/images/placeholder.jpg' }} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}

                {/* Pagination / Load More */}
                {hasMore && (
                    <div className="mt-16 flex justify-center">
                        <button
                            onClick={loadMore}
                            className="flex items-center gap-2 px-10 py-3 rounded-full border border-[#832729] text-[#832729] hover:bg-[#832729] hover:text-white transition-all font-medium tracking-wide uppercase text-sm"
                        >
                            {loading ? 'Loading...' : <>Load More <ArrowRight className="w-4 h-4 ml-1" /></>}
                        </button>
                    </div>
                )}
                {/* Choose Your Look Section */}
                <ChooseLook />
            </div>
        </div>
    );
}
