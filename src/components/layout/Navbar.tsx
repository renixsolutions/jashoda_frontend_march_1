"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { Search, Heart, ShoppingBag, User, MapPin, Menu, Diamond, Camera, Mic, X, LogOut, CheckCircle2, Mail, Package, ChevronRight, Sparkles, MessageSquare, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import MegaMenu from "./MegaMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/lib/mockData";

// We will now fetch these dynamically
const STATIC_NAV_LINKS = [
    { name: "All Jewellery", href: "/shop", hasMegaMenu: true },
];

export default function Navbar() {
    const { scrollY } = useScroll();
    const { isAuthenticated, user, logout, promptLogin } = useAuth();
    const { totalItems } = useCart();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const lenis = useLenis();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);
    const [mobileFilterOpen, setMobileFilterOpen] = useState<string | null>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    // Dynamic links will come from context
    const { genders, occasions, categories, loading: isLoadingLinks } = useNavigation();
    const searchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const [promos, setPromos] = useState<{ id: number, title: string, subtitle: string, video_url: string, link_url: string }[]>([]);
    const [marqueeData, setMarqueeData] = useState<{
        messages: { id: number, text: string }[],
        settings: { speed: number, bg_color: string, text_color: string, is_active: boolean }
    } | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    // Close suggestions on outside click
    useEffect(() => {
        setHasMounted(true);
        // Initialize theme
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
        const fetchMarquee = async () => {
            try {
                const res = await api.getMarquee();
                if (res.success) {
                    setMarqueeData(res.data);
                }
            } catch (error) {
                console.error("Error fetching marquee:", error);
            }
        };
        fetchMarquee();

        const fetchPromos = async () => {
            try {
                const res = await api.getPromos(true);
                if (res.data) setPromos(res.data);
            } catch (error) {
                console.error("Error fetching promos in navbar:", error);
            }
        };
        fetchPromos();

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

    // Close menus on navigation
    useEffect(() => {
        setActiveMenu(null);
        setIsMobileMenuOpen(false);
        setMobileSubMenu(null);
    }, [pathname, searchParams]);

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

    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-IN';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
                setIsListening(false);
                // Automatically trigger search
                router.push(`/shop?search=${encodeURIComponent(transcript.trim())}`);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const startVoiceSearch = () => {
        if (recognitionRef.current) {
            if (isListening) {
                recognitionRef.current.stop();
                setIsListening(false);
            } else {
                try {
                    recognitionRef.current.start();
                    setIsListening(true);
                } catch (err) {
                    console.error("Failed to start speech recognition", err);
                }
            }
        } else {
            alert("Voice search is not supported in this browser.");
        }
    };

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            lenis?.stop();
        } else {
            lenis?.start();
        }
    }, [isMobileMenuOpen, lenis]);

    // Generate dynamic nav links (Genders, Occasions, and Parent Categories)
    const { visibleLinks, moreLinks } = React.useMemo(() => {
        const allLinks: { name: string; href: string; hasMegaMenu?: boolean }[] = [...STATIC_NAV_LINKS];

        // Add Genders
        genders.forEach(g => {
            allLinks.push({
                name: g.name,
                href: `/shop?gender=${g.slug}`,
                hasMegaMenu: true
            });
        });

        // Add Occasions
        occasions.forEach(o => {
            allLinks.push({
                name: o.name,
                href: `/shop?occasion=${o.slug}`,
                hasMegaMenu: true
            });
        });

        // Add Parent Categories
        categories.forEach(c => {
            if (!allLinks.some(l => l.name.toLowerCase() === c.name.toLowerCase())) {
                allLinks.push({
                    name: c.name,
                    href: `/shop?category=${c.slug}`,
                    hasMegaMenu: true
                });
            }
        });

        // If more than 10 items, split them
        if (allLinks.length > 10) {
            return {
                visibleLinks: allLinks.slice(0, 9),
                moreLinks: allLinks.slice(9)
            };
        }

        return {
            visibleLinks: allLinks,
            moreLinks: []
        };
    }, [genders, occasions, categories]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        const diff = latest - previous;
        
        // Only hide after 150px scroll and when scrolling down significantly
        if (latest > 150 && diff > 5) {
            setHidden(true);
        } 
        // Show when scrolling up or at the top
        else if (diff < -5 || latest < 10) {
            setHidden(false);
        }
        
        setScrolled(latest > 20);
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
                <div className="container mx-auto px-4 lg:px-6 min-h-[44px] lg:min-h-[52px] flex items-center justify-between border-b border-gray-100 py-0.5">
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
                                    scrolled ? "h-8" : "h-12"
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
                                    scrolled ? "max-h-[32px]" : "max-h-[48px]"
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
                                placeholder={isListening ? "Listening... Speak now" : "Search for diamond jewellery"}
                                className={cn(
                                    "w-full bg-gray-50 border border-gray-200 rounded-full py-1 px-12 text-xs focus:outline-none focus:border-luxury-pink focus:ring-1 focus:ring-luxury-pink transition-all placeholder:text-gray-400",
                                    isListening && "border-luxury-pink ring-1 ring-luxury-pink shadow-[0_0_10px_rgba(240,79,105,0.2)]"
                                )}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-luxury-pink transition-colors" />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-gray-400">
                                <Camera className="w-4 h-4 hover:text-luxury-pink cursor-pointer transition-colors" />
                                <Mic 
                                    onClick={startVoiceSearch}
                                    className={cn(
                                        "w-4 h-4 cursor-pointer transition-all duration-300",
                                        isListening ? "text-[#F04F69] animate-pulse scale-125" : "hover:text-luxury-pink"
                                    )} 
                                />
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
                                                            router.push(`/shop/${item.id}`);
                                                        }}
                                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-colors border-b border-gray-50 last:border-0"
                                                    >
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                                            <img 
                                                                src={api.getMediaUrl(item.images?.[0] || item.image_url)} 
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = '/luxury-product-thumb.png';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col flex-1 min-w-0">
                                                            <span className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</span>
                                                            <div className="flex items-center justify-between mt-0.5">
                                                                <span className="text-xs text-[#702540] font-bold">{item.price_label || `₹${Number(item.price).toLocaleString()}`}</span>
                                                                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">View Detail</span>
                                                            </div>
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
                        {/* <button
                            onClick={toggleTheme}
                            className="text-charcoal hover:text-luxury-pink transition-colors relative"
                            title="Toggle Theme"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                        </button> */}
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
                            {hasMounted && isAuthenticated && user ? (
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
                                        {/* <Link
                                            href="/admin/reviews"
                                            className="w-full px-4 py-2 text-left text-sm text-[#702540] hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 font-bold"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Manage Reviews
                                        </Link> */}
                                        {/* <Link
                                            href="/admin/testimonials"
                                            className="w-full px-4 py-2 text-left text-sm text-[#702540] hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 font-bold"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Manage Testimonials
                                        </Link> */}
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
                                {hasMounted && totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#702540] text-[8px] text-white font-bold">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>



                <div className="hidden md:block border-b border-gray-100 bg-white relative">
                    <div className="container mx-auto px-4 md:px-8 min-h-[1.75rem] py-0 flex items-center justify-center gap-4 md:gap-6 lg:gap-8 text-xs font-medium text-gray-600 flex-wrap">
                        {hasMounted && visibleLinks.map((link) => (
                            <div
                                key={link.name}
                                className="h-full flex items-center"
                                onMouseEnter={() => link.hasMegaMenu && setActiveMenu(link.name)}
                                onMouseLeave={() => link.hasMegaMenu && setActiveMenu(null)}
                            >
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "relative flex items-center gap-2 hover:text-[#702540] transition-colors h-full px-2 group",
                                        activeMenu === link.name ? "text-[#702540]" : "hover:text-[#702540]",
                                        (link.name.toLowerCase() === "gift" || link.name.toLowerCase() === "gifting") ? "text-red-500 font-semibold" : 
                                        (link.name.toLowerCase() === "wedding" || link.name.toLowerCase() === "party wear") ? "text-[#702540] font-semibold" : ""
                                    )}
                                >
                                    {link.name}
                                    {activeMenu === link.name && (
                                        <motion.div 
                                            layoutId="nav-underline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#702540]"
                                            initial={false}
                                        />
                                    )}
                                </Link>

                                {/* Mega Menu Dropdown */}
                                <AnimatePresence>
                                    {link.hasMegaMenu && activeMenu === link.name && (
                                        <MegaMenu menuName={link.name} />
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        {hasMounted && moreLinks.length > 0 && (
                            <div 
                                className="h-full flex items-center relative"
                                onMouseEnter={() => setActiveMenu("More")}
                                onMouseLeave={() => setActiveMenu(null)}
                            >
                                <button
                                    className={cn(
                                        "relative flex items-center gap-2 hover:text-[#702540] transition-colors h-full px-4 group py-1",
                                        activeMenu === "More" ? "text-[#702540]" : "text-gray-600"
                                    )}
                                >
                                    More
                                    <ChevronRight className={cn("w-4 h-4 transition-transform duration-300", activeMenu === "More" && "rotate-90")} />
                                    {activeMenu === "More" && (
                                        <motion.div 
                                            layoutId="nav-underline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#702540]"
                                            initial={false}
                                        />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {activeMenu === "More" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-0 w-64 bg-white shadow-2xl border border-gray-100 py-3 z-50 rounded-b-2xl overflow-hidden"
                                        >
                                            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                                                {moreLinks.map((link) => (
                                                    <Link
                                                        key={link.name}
                                                        href={link.href}
                                                        className="flex items-center justify-between px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#702540] transition-all group/item"
                                                        onClick={() => setActiveMenu(null)}
                                                    >
                                                        <span className={cn(
                                                            "transition-colors",
                                                            (link.name.toLowerCase() === "gift" || link.name.toLowerCase() === "gifting") && "text-red-500 font-bold"
                                                        )}>
                                                            {link.name}
                                                        </span>
                                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all text-[#702540]" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
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
                                placeholder={isListening ? "Listening..." : "Search..."}
                                className={cn(
                                    "w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-10 text-sm focus:outline-none focus:border-luxury-pink",
                                    isListening && "border-luxury-pink ring-1 ring-luxury-pink"
                                )}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <Mic 
                                    onClick={startVoiceSearch}
                                    className={cn(
                                        "w-5 h-5 cursor-pointer transition-all",
                                        isListening ? "text-[#F04F69] animate-pulse" : "text-gray-400"
                                    )} 
                                />
                            </div>

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
                                            <div className="flex flex-col">
                                                {suggestions.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => {
                                                            setIsMobileMenuOpen(false);
                                                            setShowSuggestions(false);
                                                            router.push(`/shop/${item.id}`);
                                                        }}
                                                        className="px-4 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-colors"
                                                    >
                                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                                            <img 
                                                                src={api.getMediaUrl(item.images?.[0] || item.image_url)} 
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = '/luxury-product-thumb.png';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col flex-1 min-w-0">
                                                            <span className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</span>
                                                            <div className="flex items-center justify-between mt-1">
                                                                <span className="text-xs text-[#702540] font-bold">{item.price_label || `₹${Number(item.price).toLocaleString()}`}</span>
                                                                <ChevronRight className="w-4 h-4 text-gray-300" />
                                                            </div>
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
                        <div className="flex flex-col">
                            {hasMounted && [...visibleLinks, ...moreLinks].map(link => {
                                const isExpanded = mobileSubMenu === link.name;
                                return (
                                    <div key={link.name} className="flex flex-col border-b border-gray-100">
                                        <div
                                            className={cn(
                                                "text-lg font-medium py-4 flex justify-between items-center cursor-pointer",
                                                (link.name.toLowerCase() === "gift" || link.name.toLowerCase() === "gifting") ? "text-red-500 font-bold" : "text-gray-800"
                                            )}
                                            onClick={() => {
                                                if (link.hasMegaMenu) {
                                                    setMobileSubMenu(isExpanded ? null : link.name);
                                                } else {
                                                    setIsMobileMenuOpen(false);
                                                    router.push(link.href);
                                                }
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                {link.name}
                                                {link.name.toLowerCase() === 'gift' && <Sparkles size={14} className="text-red-500" />}
                                            </div>
                                            {link.hasMegaMenu ? (
                                                <ChevronRight className={cn("w-5 h-5 text-gray-400 transition-transform duration-300", isExpanded && "rotate-90")} />
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                            )}
                                        </div>

                                        {/* Expanded MegaMenu for Mobile */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-gray-50/50 rounded-xl mb-4"
                                                >
                                                    <div className="flex flex-col gap-2 p-2">
                                                        {/* Category Section */}
                                                        <div className="flex flex-col">
                                                            <button 
                                                                onClick={() => setMobileFilterOpen(mobileFilterOpen === 'cat' ? null : 'cat')}
                                                                className="flex items-center justify-between p-3 text-sm font-bold text-[#1E2856] uppercase tracking-wider bg-white rounded-lg border border-gray-100"
                                                            >
                                                                Shop by Category
                                                                <ChevronRight className={cn("w-4 h-4 transition-transform", mobileFilterOpen === 'cat' && "rotate-90")} />
                                                            </button>
                                                            {mobileFilterOpen === 'cat' && (
                                                                <div className="grid grid-cols-2 gap-2 p-2">
                                                                    {categories.map(c => (
                                                                        <Link 
                                                                            key={c.id} 
                                                                            href={`/shop?category=${c.slug}`}
                                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                                            className="p-2 text-xs bg-white border border-gray-50 rounded-md text-gray-600 hover:text-[#702540]"
                                                                        >
                                                                            {c.name}
                                                                        </Link>
                                                                    ))}
                                                                    <Link 
                                                                        href="/shop"
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                        className="p-2 text-xs bg-[#702540]/5 border border-[#702540]/20 rounded-md text-[#702540] font-bold text-center col-span-2"
                                                                    >
                                                                        View All Jewellery
                                                                    </Link>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Price Section */}
                                                        <div className="flex flex-col">
                                                            <button 
                                                                onClick={() => setMobileFilterOpen(mobileFilterOpen === 'price' ? null : 'price')}
                                                                className="flex items-center justify-between p-3 text-sm font-bold text-[#1E2856] uppercase tracking-wider bg-white rounded-lg border border-gray-100"
                                                            >
                                                                Shop by Price
                                                                <ChevronRight className={cn("w-4 h-4 transition-transform", mobileFilterOpen === 'price' && "rotate-90")} />
                                                            </button>
                                                            {mobileFilterOpen === 'price' && (
                                                                <div className="grid grid-cols-1 gap-2 p-2">
                                                                    {[
                                                                        { label: "Under ₹10k", min: 0, max: 10000 },
                                                                        { label: "₹10k - ₹25k", min: 10000, max: 25000 },
                                                                        { label: "₹25k - ₹50k", min: 25000, max: 50000 },
                                                                        { label: "Above ₹50k", min: 50000, max: 1000000 }
                                                                    ].map(range => (
                                                                        <Link 
                                                                            key={range.label}
                                                                            href={`/shop?min=${range.min}&max=${range.max}`}
                                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                                            className="flex justify-between items-center p-3 text-xs bg-white border border-gray-50 rounded-md text-gray-600"
                                                                        >
                                                                            {range.label}
                                                                            <ChevronRight size={12} className="text-gray-300" />
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Gender Section */}
                                                        <div className="flex flex-col">
                                                            <button 
                                                                onClick={() => setMobileFilterOpen(mobileFilterOpen === 'gender' ? null : 'gender')}
                                                                className="flex items-center justify-between p-3 text-sm font-bold text-[#1E2856] uppercase tracking-wider bg-white rounded-lg border border-gray-100"
                                                            >
                                                                Shop by Gender
                                                                <ChevronRight className={cn("w-4 h-4 transition-transform", mobileFilterOpen === 'gender' && "rotate-90")} />
                                                            </button>
                                                            {mobileFilterOpen === 'gender' && (
                                                                <div className="grid grid-cols-2 gap-2 p-2">
                                                                    {genders.map(g => (
                                                                        <Link 
                                                                            key={g.id}
                                                                            href={`/shop?gender=${g.slug}`}
                                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                                            className="p-3 text-xs bg-white border border-gray-50 rounded-md text-gray-600 text-center"
                                                                        >
                                                                            {g.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Occasion Section */}
                                                        <div className="flex flex-col">
                                                            <button 
                                                                onClick={() => setMobileFilterOpen(mobileFilterOpen === 'occ' ? null : 'occ')}
                                                                className="flex items-center justify-between p-3 text-sm font-bold text-[#1E2856] uppercase tracking-wider bg-white rounded-lg border border-gray-100"
                                                            >
                                                                Shop by Occasion
                                                                <ChevronRight className={cn("w-4 h-4 transition-transform", mobileFilterOpen === 'occ' && "rotate-90")} />
                                                            </button>
                                                            {mobileFilterOpen === 'occ' && (
                                                                <div className="grid grid-cols-2 gap-2 p-2">
                                                                    {occasions.map(o => (
                                                                        <Link 
                                                                            key={o.id}
                                                                            href={`/shop?occasion=${o.slug}`}
                                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                                            className="p-3 text-xs bg-white border border-gray-50 rounded-md text-gray-600 text-center"
                                                                        >
                                                                            {o.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Mobile Promo Section */}
                        {promos.length > 0 && (
                            <div className="mt-10 mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-8 h-[1px] bg-luxury-pink"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#702540]">Featured Collections</span>
                                </div>
                                <Link 
                                    href={promos[0].link_url || "/shop"} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block group relative aspect-video rounded-2xl overflow-hidden shadow-lg"
                                >
                                    <video 
                                        src={promos[0].video_url.startsWith('http') ? promos[0].video_url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'}${promos[0].video_url.startsWith('/') ? '' : '/'}${promos[0].video_url}`}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h4 className="text-white font-serif italic text-lg mb-0.5">{promos[0].title}</h4>
                                        <div className="flex items-center gap-2 text-white/80 text-[10px] uppercase font-bold tracking-tighter">
                                            Explore Now <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        <div className="mt-auto py-8 text-center text-xs text-gray-400">
                            <p>© 2024 Jashoda Jewels</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
