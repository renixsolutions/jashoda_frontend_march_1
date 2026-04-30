import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-t border-gray-100 z-50 flex justify-center"
        >
            <div className="w-full flex h-[calc(100vh-220px)]">
                {/* Left Sidebar - Tabs */}
                <div className="w-64 bg-[#FBFBFB] border-r border-gray-100 py-6 h-auto sticky top-0">
                    <div className="flex flex-col gap-1 px-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onMouseEnter={() => setActiveTab(tab)}
                                className={cn(
                                    "text-left px-5 py-3.5 text-sm font-medium transition-all duration-300 rounded-xl flex items-center justify-between group",
                                    activeTab === tab
                                        ? "text-[#111827] bg-white shadow-sm ring-1 ring-gray-100 font-bold"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                        activeTab === tab ? "bg-[#111827] scale-125" : "bg-transparent group-hover:bg-gray-300"
                                    )} />
                                    {tab}
                                </div>
                                <ChevronRight className={cn(
                                    "w-4 h-4 transition-transform duration-300",
                                    activeTab === tab ? "opacity-100 transform translate-x-0" : "opacity-0 transform -translate-x-2"
                                )} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center Content Area */}
                <div className="flex-1 p-10 bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + (currentViewName || 'root')}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className="h-full overflow-y-auto custom-scrollbar pr-4"
                        >
                            {activeTab === "Category" && (
                                <div className="flex flex-col h-full w-full">
                                    {/* Header / Back Button if nested */}
                                    {currentViewName && (
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                                            <button
                                                onClick={handleBackClick}
                                                className="p-2 rounded-full bg-gray-50 hover:bg-[#111827] transition-all text-gray-400 hover:text-white group"
                                            >
                                                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            </button>
                                            <h3 className="text-2xl font-serif text-[#1E2856] italic">{currentViewName}</h3>
                                        </div>
                                    )}

                                    {!currentViewName && (
                                        <div className="flex items-center gap-2 mb-8">
                                            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                                            <h3 className="text-xl font-bold text-[#1E2856] uppercase tracking-widest">Discover Collections</h3>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {loading ? (
                                            Array.from({ length: 8 }).map((_, i) => (
                                                <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                                                    <div className="w-24 h-24 bg-gray-100 rounded-2xl" />
                                                    <div className="h-4 bg-gray-100 rounded w-20" />
                                                </div>
                                            ))
                                        ) : currentViewItems.length > 0 ? (
                                            currentViewItems.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={(e) => handleCategoryClick(e, cat)}
                                                    className="flex flex-col items-center gap-4 group text-center"
                                                >
                                                    <div className="w-24 h-24 relative bg-white rounded-2xl p-2 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] group-hover:shadow-[0_12px_24px_rgba(112,37,64,0.12)] group-hover:border-[#111827]/20 transition-all duration-500 overflow-hidden transform group-hover:-translate-y-1">
                                                        {(cat.image_url || cat.image) ? (() => {
                                                            const imgStr = (cat.image_url || cat.image) as string;
                                                            const imgSrc = imgStr.startsWith('http') ? imgStr : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'}${imgStr.startsWith('/') ? '' : '/'}${imgStr}`;
                                                            return (
                                                                <Image
                                                                    src={imgSrc}
                                                                    alt={cat.name}
                                                                    fill
                                                                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-700"
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
                                                                className="object-contain p-2"
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-[#1E2856] group-hover:text-[#111827] transition-colors">{cat.name}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 col-span-full py-10 text-center">No categories found in this section.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === "Occasion" && (
                                <div className="flex flex-col h-full">
                                    <h3 className="text-xl font-bold text-[#1E2856] uppercase tracking-widest mb-8">Special Occasions</h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                        {occasions.map((occ) => {
                                            const imgStr = (occ.image_url || occ.image) as string | undefined;
                                            const imgSrc = imgStr ? (imgStr.startsWith('http') ? imgStr : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'}${imgStr.startsWith('/') ? '' : '/'}${imgStr}`) : '/luxury-product-thumb.png';

                                            return (
                                                <Link
                                                    key={occ.id}
                                                    href={`/shop?occasion=${occ.slug}${genderQuery}`}
                                                    className="group flex flex-col gap-4"
                                                >
                                                    <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50 relative shadow-sm group-hover:shadow-xl transition-all duration-500 border border-gray-100">
                                                        <img
                                                            src={imgSrc}
                                                            alt={occ.name}
                                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = '/diamond-pendant.png';
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-60 group-hover:opacity-20 transition-opacity" />
                                                        <div className="absolute bottom-4 left-0 w-full text-center">
                                                            <span className="text-white text-xs font-bold tracking-widest uppercase">{occ.name}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {activeTab === "Price" && (
                                <div className="flex flex-col gap-6 max-w-xl">
                                    <h3 className="text-xl font-bold text-[#1E2856] uppercase tracking-widest mb-8 text-center md:text-left">Shop by Price</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {PRICERANGES.map((range) => (
                                            <Link
                                                key={range.label}
                                                href={`/shop?min=${range.min}&max=${range.max}${genderQuery}`}
                                                className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-[#111827]/30 hover:bg-rose-50/20 hover:shadow-lg hover:shadow-[#111827]/5 transition-all group"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400 uppercase tracking-tighter mb-0.5">Starting</span>
                                                    <span className="text-[#1E2856] font-bold group-hover:text-[#111827]">{range.label}</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#111827] transition-colors">
                                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-8 bg-gradient-to-br from-rose-50/50 to-white rounded-[32px] border border-rose-100/50">
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full relative overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: "65%" }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#111827] to-[#D4AF37] rounded-full" 
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">
                                            <span>Budget Friendly</span>
                                            <span>Ultra Luxury</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Gender" && (
                                <div className="flex flex-col h-full">
                                    <h3 className="text-xl font-bold text-[#1E2856] uppercase tracking-widest mb-8">Who are you shopping for?</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {genders.map(g => (
                                            <Link
                                                key={g.id}
                                                href={`/shop?gender=${g.slug}`}
                                                className="group relative h-48 rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                                            >
                                                <div className="absolute inset-0 bg-[#FBFBFB] group-hover:bg-rose-50 transition-colors" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                                                    <span className="text-2xl font-serif italic text-[#1E2856] mb-2">{g.name}</span>
                                                    <div className="h-0.5 w-12 bg-[#111827]/20 group-hover:w-20 group-hover:bg-[#111827] transition-all duration-500" />
                                                    <span className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">Shop Collection</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Side - Promo Queue */}
                <div className="w-[300px] lg:w-[300px] xl:w-[300px] h-full relative flex-shrink-0 flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] border-l border-gray-800">
                    <AnimatePresence mode="wait">
                        {currentPromo ? (
                            <motion.div
                                key={currentPromo.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <video
                                    src={getPromoVideoUrl(currentPromo.video_url)}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    playsInline
                                    loop={promos.length === 1}
                                    onEnded={handleVideoEnded}
                                    onError={(e) => {
                                        // Fallback to a placeholder if video fails
                                        (e.target as HTMLVideoElement).parentElement!.style.background = "linear-gradient(45deg, #1E2856, #111827)";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2856] via-transparent to-black/20" />

                                <div className="absolute bottom-0 left-0 w-full p-6 xl:p-8 text-white z-10">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[8px] xl:text-[10px] font-bold uppercase tracking-widest mb-3 border border-white/10 items-center gap-2 flex w-fit">
                                            <div className="w-1 h-1 rounded-full bg-[#D4AF37] animate-pulse" />
                                            Featured
                                        </span>
                                        {currentPromo.title && (
                                            <h4 className="text-lg lg:text-xl xl:text-3xl font-serif italic mb-2 leading-tight">
                                                {currentPromo.title}
                                            </h4>
                                        )}
                                        {currentPromo.link_url && (
                                            <Link 
                                                href={currentPromo.link_url} 
                                                className="group inline-flex items-center gap-2 text-[9px] xl:text-[11px] font-bold uppercase tracking-[0.2em] bg-white text-[#1E2856] py-2 px-5 xl:py-3 xl:px-8 rounded-full hover:bg-[#111827] hover:text-white transition-all duration-300 shadow-lg active:scale-95"
                                            >
                                                Explore
                                                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        )}
                                    </motion.div>
                                </div>

                                {promos.length > 1 && (
                                    <div className="absolute top-10 right-6 flex flex-col gap-2 z-10">
                                        {promos.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentPromoIndex(idx)}
                                                className={cn(
                                                    "w-1 rounded-full transition-all duration-500",
                                                    idx === currentPromoIndex ? "h-5 bg-[#D4AF37]" : "h-1.5 bg-white/20 hover:bg-white/40"
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-white/20 gap-4 p-10 text-center w-full h-full bg-[#0A0A0A]">
                                <Sparkles size={40} className="animate-pulse" />
                                <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Signature Collections</span>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
