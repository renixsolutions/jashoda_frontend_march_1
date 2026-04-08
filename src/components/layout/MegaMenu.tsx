import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { Category } from "@/lib/mockData";
import Image from "next/image";
import { useNavigation } from "@/contexts/NavigationContext";
import { useRouter } from "next/navigation";

// Remove static OCCASIONS and GENDER arrays since we are now dynamically fetching them
const PRICERANGES = [
    { label: "Under ₹10k", min: 0, max: 10000 },
    { label: "₹10k - ₹25k", min: 10000, max: 25000 },
    { label: "₹25k - ₹50k", min: 25000, max: 50000 },
    { label: "₹50k - ₹1L", min: 50000, max: 100000 },
    { label: "Above ₹1L", min: 100000, max: 1000000 },
];

type Tab = "Category" | "Price" | "Occasion" | "Gender";

interface MegaMenuProps {
    menuName?: string;
}

export default function MegaMenu({ menuName = "All Jewellery" }: MegaMenuProps) {
    const { genders, occasions, categories: allParentCategories, loading: isNavLoading } = useNavigation();
    const router = useRouter();

    // Remove hardcoded mapping
    const [activeTab, setActiveTab] = useState<Tab>("Category");
    const [categories, setCategories] = useState<Category[]>([]);
    // genders and occasions come from context
    const [loading, setLoading] = useState(false);
    const [promos, setPromos] = useState<{ id: number, title: string, subtitle: string, video_url: string, link_url: string }[]>([]);
    const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

    const [genderSlug, setGenderSlug] = useState("");
    const [occasionSlug, setOccasionSlug] = useState("");

    const genderQuery = genderSlug ? `&gender=${genderSlug}` : "";
    const occasionQuery = occasionSlug ? `&occasion=${occasionSlug}` : "";

    // State to handle nested views
    const [viewStack, setViewStack] = useState<{ id: number; name: string; items: Category[] }[]>([]);

    useEffect(() => {
        let isMounted = true;

        // Reset view stack and slugs when menuName changes
        if (isMounted) {
            setViewStack([]);
            setGenderSlug("");
            setOccasionSlug("");
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Determine if menuName is a gender or occasion from context-supplied data
                const matchedGender = genders.find(g => g.name.toLowerCase() === menuName.toLowerCase());
                if (matchedGender) setGenderSlug(matchedGender.slug);

                const matchedOccasion = occasions.find(o => o.name.toLowerCase() === menuName.toLowerCase());
                if (matchedOccasion) setOccasionSlug(matchedOccasion.slug);

                // For the right promo banner, we still fetch specifically for each menu if needed
                // but for now let's just use the shared ones if possible or fetch once
                // Actually promos are very specific, maybe keep them internal or move to context too.
                // For now, I'll fetch promos here.
                const promosRes = await api.getPromos(true).catch(() => null);
                if (isMounted && promosRes?.data) setPromos(promosRes.data);

                let displayCategories: Category[] = [];

                if (menuName === "All Jewellery") {
                    const res = await api.getParentCategories().catch(() => null);
                    if (res && res.data) {
                        displayCategories = res.data;
                    } else {
                        displayCategories = allParentCategories;
                    }
                } else {
                    const parentRes = await api.getParentCategories().catch(() => null);
                    const currentParents = (parentRes && parentRes.data) ? parentRes.data : allParentCategories;
                    
                    const matchingParent = currentParents.find(
                        (p: Category) => p.name.toLowerCase() === menuName.toLowerCase()
                    );
                    if (matchingParent) {
                        const subRes = await api.getSubcategories(matchingParent.id);
                        if (subRes && subRes.data) {
                            displayCategories = subRes.data;
                        }
                    } else {
                        // If it's a gender or occasion, show all parent categories dynamically too
                        displayCategories = currentParents;
                    }
                }

                if (isMounted) {
                    setCategories(displayCategories || []);
                }
            } catch (error) {
                console.error("Error setting menu categories:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [menuName, genders, occasions, allParentCategories]);

    const handleCategoryClick = async (e: React.MouseEvent, category: Category) => {
        // ... rest of the code should use genderQuery and occasionQuery
        e.preventDefault();
        setLoading(true);
        try {
            const subRes = await api.getSubcategories(category.id);
            if (subRes && subRes.data && subRes.data.length > 0) {
                setViewStack((prev) => [
                    ...prev,
                    { id: category.id, name: category.name, items: subRes.data }
                ]);
            } else {
                const isSubcategory = viewStack.length > 0;
                const paramName = isSubcategory ? 'subcategory' : 'category';
                // Find parent and current slugs if needed, but for now we keep it simple
                router.push(`/shop?${paramName}=${category.slug}${genderQuery}${occasionQuery}`);
            }
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            const isSubcategory = viewStack.length > 0;
            const paramName = isSubcategory ? 'subcategory' : 'category';
            router.push(`/shop?${paramName}=${category.slug}${genderQuery}${occasionQuery}`);
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        setViewStack((prev) => prev.slice(0, -1));
    };

    // Determine current items to display
    const currentViewItems = viewStack.length > 0 ? viewStack[viewStack.length - 1].items : categories;
    const currentViewName = viewStack.length > 0 ? viewStack[viewStack.length - 1].name : null;

    // Dynamically calculate tabs based on selection
    const tabs: Tab[] = ["Category", "Price"];
    if (!occasionSlug) tabs.push("Occasion");
    if (!genderSlug) tabs.push("Gender");

    const handleVideoEnded = () => {
        if (promos.length > 1) {
            setCurrentPromoIndex((prev) => (prev + 1) % promos.length);
        }
    };

    const currentPromo = promos.length > 0 ? promos[currentPromoIndex] : null;

    // Fallback URL formatting for promos
    const getPromoVideoUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const apiDomain = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
        return `${apiDomain}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50 flex justify-center h-[500px]">
            <div className="container mx-auto flex h-full">
                {/* Left Sidebar - Tabs */}
                <div className="w-64 bg-white border-r border-gray-100 py-6 h-full flex flex-col">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onMouseEnter={() => {
                                setActiveTab(tab);
                                // Optional: Reset view stack when changing tabs
                                // setViewStack([]);
                            }}
                            className={cn(
                                "text-left px-8 py-4 text-sm font-medium transition-colors flex justify-between items-center relative",
                                activeTab === tab
                                    ? "text-luxury-pink font-semibold bg-rose-50/30"
                                    : "text-gray-600 hover:text-luxury-pink hover:bg-gray-50"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-luxury-pink rounded-r-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Center Content Area */}
                <div className="flex-1 p-8 overflow-y-auto bg-white">
                    {activeTab === "Category" && (
                        <div className="flex flex-col h-full w-full">
                            {/* Header / Back Button if nested */}
                            {currentViewName && (
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <button
                                        onClick={handleBackClick}
                                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-luxury-pink"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <h3 className="text-lg font-serif text-charcoal">{currentViewName}</h3>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-y-6 gap-x-8 mt-2">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 animate-pulse">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                            <div className="h-4 bg-gray-200 rounded w-24" />
                                        </div>
                                    ))
                                ) : currentViewItems.length > 0 ? (
                                    currentViewItems.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={(e) => handleCategoryClick(e, cat)}
                                            className="flex items-center gap-3 group text-gray-700 hover:text-luxury-pink transition-colors text-left w-full"
                                        >
                                            <div className="w-10 h-10 relative flex-shrink-0 bg-gray-50 rounded-full overflow-hidden group-hover:bg-rose-50 transition-colors border border-gray-100">
                                                {(cat.image_url || cat.image) ? (() => {
                                                    const imgStr = (cat.image_url || cat.image) as string;
                                                    const imgSrc = imgStr.startsWith('http') ? imgStr : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'}${imgStr.startsWith('/') ? '' : '/'}${imgStr}`;
                                                    return (
                                                        <Image
                                                            src={imgSrc}
                                                            alt={cat.name}
                                                            fill
                                                            className="object-cover p-1.5"
                                                            unoptimized
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = '/diamond-pendant.png';
                                                            }}
                                                        />
                                                    );
                                                })() : (
                                                    <Image
                                                        src="/diamond-pendant.png"
                                                        alt={cat.name}
                                                        fill
                                                        className="object-cover p-1.5"
                                                    />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium">{cat.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 col-span-3">No categories found.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "Occasion" && (
                        <div className="grid grid-cols-4 gap-6">
                            {occasions.length > 0 ? occasions.map((occ) => {
                                const imgStr = (occ.image_url || occ.image) as string | undefined;
                                const imgSrc = imgStr ? (imgStr.startsWith('http') ? imgStr : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'}${imgStr.startsWith('/') ? '' : '/'}${imgStr}`) : '/luxury-product-thumb.png';

                                return (
                                    <Link
                                        key={occ.id}
                                        href={`/shop?occasion=${occ.slug}${genderQuery}`}
                                        className="group flex flex-col gap-3"
                                    >
                                        <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 relative">
                                            <img
                                                src={imgSrc}
                                                alt={occ.name}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/diamond-pendant.png';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                        </div>
                                        <span className="text-center text-sm font-medium text-gray-700 group-hover:text-luxury-pink transition-colors">
                                            {occ.name}
                                        </span>
                                    </Link>
                                );
                            }) : (
                                <p className="text-sm text-gray-500 col-span-4">No occasions found.</p>
                            )}
                        </div>
                    )}

                    {activeTab === "Price" && (
                        <div className="flex flex-col gap-6 max-w-md">
                            <h3 className="text-lg font-serif text-charcoal mb-4">Shop By Price</h3>
                            <div className="space-y-4">
                                {PRICERANGES.map((range) => (
                                    <Link
                                        key={range.label}
                                        href={`/shop?min=${range.min}&max=${range.max}${genderQuery}`}
                                        className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-luxury-pink hover:bg-rose-50/30 transition-all group"
                                    >
                                        <span className="text-gray-700 group-hover:text-luxury-pink">{range.label}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-luxury-pink" />
                                    </Link>
                                ))}
                            </div>
                            {/* Visual Meter Concept */}
                            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                                <div className="h-2 w-full bg-gray-200 rounded-full relative">
                                    <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-luxury-pink to-soft-rose rounded-full" />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>₹0</span>
                                    <span>₹10L+</span>
                                </div>
                                <p className="text-xs text-center mt-2 text-gray-400">Drag to filter (Coming Soon)</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "Gender" && (
                        <div className="grid grid-cols-2 gap-4 max-w-sm">
                            {genders.length > 0 ? genders.map(g => (
                                <Link
                                    key={g.id}
                                    href={`/shop?gender=${g.slug}`}
                                    className="p-6 text-center border border-gray-100 rounded-lg hover:border-luxury-pink hover:bg-rose-50/30 text-gray-700 hover:text-luxury-pink transition-all font-medium"
                                >
                                    {g.name}
                                </Link>
                            )) : (
                                <p className="text-sm text-gray-500 col-span-2">No genders found.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side - Promo Queue */}
                <div className="w-[300px] h-full relative hidden lg:block bg-black flex flex-col items-center justify-center overflow-hidden">
                    {currentPromo ? (
                        <>
                            <video
                                key={currentPromo.id}
                                src={getPromoVideoUrl(currentPromo.video_url)}
                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                                autoPlay
                                muted
                                playsInline
                                loop={promos.length === 1}
                                onEnded={handleVideoEnded}
                            />
                            {/* Overlay gradient for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10 transition-all duration-500 transform translate-y-0">
                                {currentPromo.title && <h4 className="font-serif text-xl mb-1">{currentPromo.title}</h4>}
                                {currentPromo.subtitle && <p className="text-sm opacity-90 mb-3">{currentPromo.subtitle}</p>}
                                {currentPromo.link_url && (
                                    <Link href={currentPromo.link_url} className="inline-block text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white text-white hover:text-black py-2 px-4 rounded-full backdrop-blur-sm transition-all duration-300">
                                        Explore Now
                                    </Link>
                                )}
                            </div>

                            {/* Queue progress dots (if multiple) */}
                            {promos.length > 1 && (
                                <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
                                    {promos.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "w-1.5 rounded-full transition-all duration-300",
                                                idx === currentPromoIndex ? "h-4 bg-luxury-pink" : "h-1.5 bg-white/50"
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No promo available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
