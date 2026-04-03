"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, MapPin, Menu, Diamond, Camera, Mic, X, LogOut, CheckCircle2, Mail, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import MegaMenu from "./MegaMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/lib/mockData";

const BOTTOM_NAV_LINKS = [
    { name: "All Jewellery", href: "/shop", hasMegaMenu: true },
    { name: "Men", href: "/shop?category=men", hasMegaMenu: true },
    { name: "Women", href: "/shop?category=women", hasMegaMenu: true },
    { name: "Kids", href: "/shop?category=kids" },
    // { name: "Rings", href: "/shop" },
    // { name: "Daily Wear", href: "/shop" },
    // { name: "Collections", href: "/shop" },
    { name: "Wedding", href: "/shop?occasion=wedding" },
    { name: "Gifting", href: "/shop?occasion=gifting" },
    { name: "Idols", href: "/shop?category=idols" },
    { name: "Puja", href: "/shop?category=puja" },
    { name: "More", href: "/shop" },
];

export default function Navbar() {
    const { scrollY } = useScroll();
    const { isAuthenticated, user, logout, promptLogin } = useAuth();
    const { totalItems } = useCart();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
            if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search fetch
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSuggestionsLoading(true);
            try {
                const response = await api.getProducts({ search: searchQuery.trim(), limit: 5 });
                if (response.success) {
                    setSuggestions(response.data);
                    setShowSuggestions(true);
                }
            } catch (err) {
                console.error("Failed to fetch search suggestions", err);
            } finally {
                setIsSuggestionsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setIsMobileMenuOpen(false); // Close mobile menu if open
            setShowSuggestions(false);
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setScrolled(latest > 50);
    });

    return (
        <>
            <motion.nav
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300",
                    scrolled ? "bg-white shadow-md text-charcoal" : "bg-white/95 backdrop-blur-md text-charcoal"
                )}
            >
                {/* TOP ROW: Logo, Search, Icons */}
                <div className="container mx-auto px-4 lg:px-6 h-20 flex items-center justify-between border-b border-gray-100">
                    {/* Mobile Menu Trigger & Mobile Logo */}
                    <div className="flex md:hidden items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6 text-charcoal" />
                        </button>
                        <Link href="/" className="flex-shrink-0">
                            <img
                                src="/jashoda-logo.png"
                                alt="Jashoda Jewels"
                                className={cn(
                                    "w-auto object-contain transition-all duration-300",
                                    scrolled ? "h-10" : "h-14"
                                )}
                            />
                        </Link>
                    </div>

                    {/* Desktop Logo */}
                    <div className="hidden md:flex flex-shrink-0 w-1/4">
                        <Link href="/" className="flex flex-col items-center">
                            <img
                                src="/jashoda-logo.png"
                                alt="Jashoda Jewels"
                                className={cn(
                                    "w-auto object-contain transition-all duration-300",
                                    scrolled ? "h-16" : "h-24"
                                )}
                            />
                        </Link>
                    </div>

                    {/* Search Bar (Centered) */}
                    <div className="flex-1 max-w-xl px-8 hidden md:block" ref={searchRef}>
                        <div className="relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Search for diamond jewellery"
                                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 px-12 text-sm focus:outline-none focus:border-luxury-pink focus:ring-1 focus:ring-luxury-pink transition-all placeholder:text-gray-400"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-luxury-pink transition-colors" />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-gray-400">
                                <Camera className="w-4 h-4 hover:text-luxury-pink cursor-pointer transition-colors" />
                                <Mic className="w-4 h-4 hover:text-luxury-pink cursor-pointer transition-colors" />
                            </div>

                            {/* Suggestions Dropdown */}
                            <AnimatePresence>
                                {showSuggestions && searchQuery.trim() && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                    >
                                        {isSuggestionsLoading ? (
                                            <div className="p-4 text-center text-sm text-gray-500">Loading suggestions...</div>
                                        ) : suggestions.length > 0 ? (
                                            <div className="py-2">
                                                {suggestions.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => {
                                                            setShowSuggestions(false);
                                                            router.push(`/shop?search=${encodeURIComponent(item.name)}`);
                                                        }}
                                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                                                    >
                                                        <Search className="w-4 h-4 text-gray-400" />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</span>
                                                            <span className="text-xs text-gray-500">{item.price_label || `₹${Number(item.price).toLocaleString()}`}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div
                                                    onClick={() => {
                                                        setShowSuggestions(false);
                                                        router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                                                    }}
                                                    className="px-4 py-3 bg-gray-50 text-sm text-luxury-pink font-medium hover:bg-gray-100 cursor-pointer text-center mt-2 border-t border-gray-100"
                                                >
                                                    View all results for "{searchQuery}"
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-sm text-gray-500">No products found</div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center justify-end gap-5 md:gap-6 w-1/4">
                        <button
                            onClick={() => {
                                if (isAuthenticated) {
                                    router.push('/shop'); // Or wherever collections leads to
                                } else {
                                    promptLogin();
                                }
                            }}
                            className="hidden lg:block text-charcoal hover:text-luxury-pink transition-colors"
                            title="Collections"
                        >
                            <Diamond className="w-5 h-5" />
                        </button>
                        <button className="hidden lg:block text-charcoal hover:text-luxury-pink transition-colors" title="Stores">
                            <MapPin className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                if (isAuthenticated) {
                                    router.push('/wishlist');
                                } else {
                                    promptLogin();
                                }
                            }}
                            className="text-charcoal hover:text-luxury-pink transition-colors relative"
                            title="Wishlist"
                        >
                            <Heart className="w-5 h-5" />
                        </button>
                        <div className="relative">
                            {isAuthenticated && user ? (
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="text-charcoal hover:text-luxury-pink transition-colors relative flex items-center gap-2"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="hidden lg:block text-sm font-medium">{user.name || user.email?.split('@')[0]}</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (typeof window !== 'undefined' && (window as any).openAuthModal) {
                                            (window as any).openAuthModal();
                                        }
                                    }}
                                    className="text-charcoal hover:text-luxury-pink transition-colors relative"
                                >
                                    <User className="w-5 h-5" />
                                </button>
                            )}

                            {/* User Dropdown Menu */}
                            <AnimatePresence>
                                {isUserMenuOpen && isAuthenticated && user && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                                        onMouseLeave={() => setIsUserMenuOpen(false)}
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-semibold text-gray-900 text-sm">{user.name || 'User'}</p>
                                            <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                {user.email_verified ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Email Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs text-orange-600 font-medium">
                                                        <Mail className="w-3 h-3" />
                                                        Email Unverified
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Link
                                            href="/orders"
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <Package className="w-4 h-4 text-gray-400" />
                                            My Orders
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsUserMenuOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4 text-gray-400" />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button
                            onClick={() => {
                                if (isAuthenticated) {
                                    router.push('/cart');
                                } else {
                                    promptLogin();
                                }
                            }}
                            className="text-charcoal hover:text-luxury-pink transition-colors relative flex items-center gap-1"
                            title="Cart"
                        >
                            <div className="relative">
                                <ShoppingBag className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#702540] text-[8px] text-white font-bold">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Promotional Marquee */}
                <div className="w-full overflow-hidden bg-[#702540] text-white py-2 flex text-xs md:text-sm tracking-widest font-medium uppercase relative">
                    <motion.div
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ ease: "linear", duration: 25, repeat: Infinity }}
                        className="flex whitespace-nowrap items-center w-max"
                    >
                        <div className="flex gap-12 px-6 items-center">
                            <span>Free Shipping On Orders Above ₹50,000</span>
                            <span className="text-white/60 text-[10px]">✦</span>
                            <span>100% Certified Jewellery</span>
                            <span className="text-white/60 text-[10px]">✦</span>
                            <span>Lifetime Exchange & Buyback</span>
                            <span className="text-white/60 text-[10px]">✦</span>
                            <span>Secure & Insured Delivery</span>
                            <span className="text-white/60 text-[10px]">✦</span>
                        </div>
                        <div className="flex gap-12 px-6 items-center">
                            <span>Free Shipping On Orders Above ₹50,000</span>
                            <span className="text-white/60 text-[10px]">✦</span>
                            <span>100% Certified Jewellery</span>
                            <span className="text-white/60 text-[10px]">✦</span>
                            <span>Lifetime Exchange & Buyback</span>
                            <span className="text-white/60 text-[10px]">✦</span>
                            <span>Secure & Insured Delivery</span>
                            <span className="text-white/60 text-[10px]">✦</span>
                        </div>
                    </motion.div>
                </div>

                {/* BOTTOM ROW: Categories */}
                <div className="hidden md:block border-b border-gray-100 bg-white relative">
                    <div className="container mx-auto px-6 h-12 flex items-center justify-center gap-8 text-sm font-medium text-gray-600">
                        {BOTTOM_NAV_LINKS.map((link) => (
                            <div
                                key={link.name}
                                className="h-full flex items-center"
                                onMouseEnter={() => link.hasMegaMenu && setActiveMenu(link.name)}
                                onMouseLeave={() => link.hasMegaMenu && setActiveMenu(null)}
                            >
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-2 hover:text-[#702540] transition-colors h-full border-b-2 border-transparent",
                                        activeMenu === link.name ? "text-[#702540] border-[#702540]" : "hover:border-[#702540]",
                                        link.name === "Gifting" && "text-red-500 font-semibold"
                                    )}
                                >
                                    {/* Icons for specific items can be added here if needed, keeping simple for now */}
                                    {link.name}
                                </Link>

                                {/* Mega Menu Dropdown */}
                                {link.hasMegaMenu && activeMenu === link.name && (
                                    <MegaMenu menuName={link.name} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-white text-charcoal flex flex-col pt-6 px-6 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <img src="/jashoda-logo.png" alt="Logo" className="h-10 w-auto" />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-500 hover:text-charcoal"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Search for Mobile */}
                        <div className="mb-8 relative" ref={mobileSearchRef}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Search..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-10 text-sm focus:outline-none focus:border-luxury-pink"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                            {/* Mobile Suggestions Dropdown */}
                            <AnimatePresence>
                                {showSuggestions && searchQuery.trim() && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                                    >
                                        {isSuggestionsLoading ? (
                                            <div className="p-4 text-center text-sm text-gray-500">Loading suggestions...</div>
                                        ) : suggestions.length > 0 ? (
                                            <div className="py-2">
                                                {suggestions.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => {
                                                            setIsMobileMenuOpen(false);
                                                            setShowSuggestions(false);
                                                            router.push(`/shop?search=${encodeURIComponent(item.name)}`);
                                                        }}
                                                        className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                                                    >
                                                        <Search className="w-4 h-4 text-gray-400" />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</span>
                                                            <span className="text-xs text-gray-500">{item.price_label || `₹${Number(item.price).toLocaleString()}`}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div
                                                    onClick={() => {
                                                        setIsMobileMenuOpen(false);
                                                        setShowSuggestions(false);
                                                        router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                                                    }}
                                                    className="px-4 py-3 bg-gray-50 text-sm text-luxury-pink font-medium text-center cursor-pointer"
                                                >
                                                    View all results
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-sm text-gray-500">No products found</div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Links */}
                        <div className="flex flex-col gap-4">
                            {BOTTOM_NAV_LINKS.map(link => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-gray-800 border-b border-gray-50 pb-3 flex justify-between items-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto py-8 text-center text-xs text-gray-400">
                            <p>© 2024 Jashoda Jewels</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
