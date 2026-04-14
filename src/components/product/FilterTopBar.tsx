"use client";

import React from "react";
import { ChevronDown, Filter, X, Plus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useNavigation } from "@/contexts/NavigationContext";
import FilterDropdown from "./FilterDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterPillProps {
    label: string;
    onRemove?: () => void;
    active?: boolean;
}

const FilterPill = ({ label, onRemove, active }: FilterPillProps) => (
    <button
        onClick={onRemove}
        className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border shrink-0
      ${active
                ? "bg-[#702540] text-white border-[#702540] shadow-lg shadow-rose-900/10 hover:bg-[#5a1d33] hover:-translate-y-0.5"
                : "bg-white/80 backdrop-blur-md text-[#404040] border-gray-100 shadow-sm hover:border-[#702540] hover:text-[#702540]"
            }
    `}
    >
        {label}
        <div className="p-0.5 rounded-full bg-black/10 hover:bg-black/20 transition-colors">
            <X className="w-2.5 h-2.5" />
        </div>
    </button>
);

export default function FilterTopBar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { categories, genders, occasions } = useNavigation();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

    const activeFilters: { key: string, label: string }[] = [];

    // Parse active filters from query params
    const categoryId = searchParams.get('category');
    const subcategoryId = searchParams.get('subcategory');
    const genderId = searchParams.get('gender');
    const occasionId = searchParams.get('occasion');
    const search = searchParams.get('search');
    const min = searchParams.get('min');
    const max = searchParams.get('max');

    if (genderId) {
        const gender = genders.find(g => String(g.id) === genderId || g.slug === genderId);
        activeFilters.push({ key: 'gender', label: gender ? gender.name : genderId });
    }
    if (occasionId) {
        const occasion = occasions.find(o => String(o.id) === occasionId || o.slug === occasionId);
        activeFilters.push({ key: 'occasion', label: occasion ? occasion.name : occasionId });
    }
    if (categoryId) {
        const category = categories.find(c => String(c.id) === categoryId || c.slug === categoryId);
        activeFilters.push({ key: 'category', label: category ? category.name : categoryId });
    }
    if (subcategoryId) {
        const subcat = categories.find(c => String(c.id) === subcategoryId || c.slug === subcategoryId);
        activeFilters.push({ key: 'subcategory', label: subcat ? subcat.name : subcategoryId });
    }
    if (search) {
        activeFilters.push({ key: 'search', label: `Search: ${search}` });
    }
    if (min && max) {
        activeFilters.push({ key: 'price', label: `₹${Number(min).toLocaleString()} - ₹${Number(max).toLocaleString()}` });
    }

    const removeFilter = (key: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (key === 'price') {
            params.delete('min');
            params.delete('max');
        } else {
            params.delete(key);
        }
        router.push(`/shop?${params.toString()}`);
    };

    const clearAll = () => {
        router.push('/shop');
    };

    // Suggestions for new filters if few are active
    const suggestions = [
      { key: 'category', label: 'Neckwear', value: 'neckwear' },
      { key: 'category', label: 'Rings', value: 'rings' },
      { key: 'gender', label: 'Female', value: 'female' },
    ].filter(s => !searchParams.has(s.key));

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (!value) {
            params.delete(key);
            if (key === 'price') {
                params.delete('min');
                params.delete('max');
            }
        } else if (key === 'price') {
            const range = PRICERANGES.find(r => r.label === value);
            if (range) {
                params.set('min', String(range.min));
                params.set('max', String(range.max));
            }
        } else {
            params.set(key, value);
        }
        router.push(`/shop?${params.toString()}`);
    };

    const PRICERANGES = [
        { label: "Under ₹10,000", min: 0, max: 10000 },
        { label: "₹10,000 - ₹25,000", min: 10000, max: 25000 },
        { label: "₹25,000 - ₹50,000", min: 25000, max: 50000 },
        { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
        { label: "Above ₹1,00,000", min: 100000, max: 1000000 },
    ];

    return (
        <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-10">
            {/* Desktop Filter Row */}
            <div className="hidden md:flex flex-wrap items-center gap-3 border-b border-[#E0E0E0] pb-6 px-1">
                <button 
                    onClick={clearAll}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shrink-0 h-10 shadow-sm border",
                        activeFilters.length === 0
                            ? "bg-[#702540] text-white border-[#702540] shadow-md"
                            : "bg-white text-gray-400 border-gray-100 hover:text-[#702540] hover:border-[#702540]"
                    )}
                >
                    <Filter className="w-3.5 h-3.5" />
                    All
                </button>

                <FilterDropdown 
                    label="Category"
                    options={categories.map(c => ({ label: c.name, value: c.slug }))}
                    selectedValue={categoryId || subcategoryId || ""}
                    onApply={(val) => updateFilter('category', val)}
                    onClear={() => removeFilter(categoryId ? 'category' : 'subcategory')}
                    active={!!(categoryId || subcategoryId)}
                />

                <FilterDropdown 
                    label="Gender"
                    options={genders.map(g => ({ label: g.name, value: g.slug }))}
                    selectedValue={genderId || ""}
                    onApply={(val) => updateFilter('gender', val)}
                    onClear={() => removeFilter('gender')}
                    active={!!genderId}
                />

                <FilterDropdown 
                    label="Occasion"
                    options={occasions.map(o => ({ label: o.name, value: o.slug }))}
                    selectedValue={occasionId || ""}
                    onApply={(val) => updateFilter('occasion', val)}
                    onClear={() => removeFilter('occasion')}
                    active={!!occasionId}
                />

                <FilterDropdown 
                    label="Price"
                    options={PRICERANGES.map(r => ({ label: r.label, value: r.label }))}
                    selectedValue={min && max ? PRICERANGES.find(r => r.min === Number(min) && r.max === Number(max))?.label || "" : ""}
                    onApply={(val) => updateFilter('price', val)}
                    onClear={() => removeFilter('price')}
                    active={!!(min && max)}
                />

                {activeFilters.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="text-[10px] text-[#702540] font-bold hover:underline ml-2 uppercase tracking-widest shrink-0"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Mobile Active Filters - Horizontal Scrollable Row */}
            <div className="md:hidden w-full overflow-x-auto no-scrollbar pb-2 scroll-smooth">
                {activeFilters.length > 0 && (
                    <div className="flex flex-nowrap items-center gap-2">
                        {activeFilters.map((filter) => (
                            <FilterPill 
                                key={filter.key} 
                                label={filter.label} 
                                active 
                                onRemove={() => removeFilter(filter.key)} 
                            />
                        ))}
                        <button 
                            onClick={clearAll}
                            className="text-[10px] text-[#702540] font-bold uppercase tracking-widest px-2 shrink-0"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Floating Button */}
            <div className="md:hidden fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="flex items-center gap-2 px-6 py-4 rounded-full bg-[#702540] text-white shadow-2xl active:scale-95 transition-all"
                >
                    <Filter className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-widest text-xs">Filter</span>
                    {activeFilters.length > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#702540] text-[10px] font-bold">
                            {activeFilters.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 z-[70] md:hidden max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-serif text-[#702540] italic">Filter Jewellery</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-50 rounded-full">
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <section>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Categories</span>
                                    <div className="grid grid-cols-2 gap-3">
                                        {categories.map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => { updateFilter('category', c.slug); setIsMobileFilterOpen(false); }}
                                                className={cn(
                                                    "px-4 py-3 rounded-xl text-xs text-center border transition-all",
                                                    (categoryId === c.slug || subcategoryId === c.slug)
                                                        ? "bg-rose-50 border-[#702540] text-[#702540] font-bold"
                                                        : "border-gray-100 text-gray-600"
                                                )}
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Gender</span>
                                    <div className="flex flex-wrap gap-3">
                                        {genders.map(g => (
                                            <button
                                                key={g.id}
                                                onClick={() => { updateFilter('gender', g.slug); setIsMobileFilterOpen(false); }}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl text-xs border transition-all",
                                                    genderId === g.slug
                                                        ? "bg-rose-50 border-[#702540] text-[#702540] font-bold"
                                                        : "border-gray-100 text-gray-600"
                                                )}
                                            >
                                                {g.name}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Occasion</span>
                                    <div className="flex flex-wrap gap-3">
                                        {occasions.map(o => (
                                            <button
                                                key={o.id}
                                                onClick={() => { updateFilter('occasion', o.slug); setIsMobileFilterOpen(false); }}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl text-xs border transition-all",
                                                    occasionId === o.slug
                                                        ? "bg-rose-50 border-[#702540] text-[#702540] font-bold"
                                                        : "border-gray-100 text-gray-600"
                                                )}
                                            >
                                                {o.name}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block">Price Range</span>
                                    <div className="space-y-2">
                                        {PRICERANGES.map(r => (
                                            <button
                                                key={r.label}
                                                onClick={() => { updateFilter('price', r.label); setIsMobileFilterOpen(false); }}
                                                className={cn(
                                                    "w-full px-6 py-3 rounded-xl text-xs text-left border transition-all flex justify-between items-center",
                                                    (min && max && PRICERANGES.find(p => p.min === Number(min) && p.max === Number(max))?.label === r.label)
                                                        ? "bg-rose-50 border-[#702540] text-[#702540] font-bold"
                                                        : "border-gray-100 text-gray-600"
                                                )}
                                            >
                                                {r.label}
                                                <ChevronDown className="w-4 h-4 opacity-50" />
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-100 flex gap-4">
                                <button
                                    onClick={() => { clearAll(); setIsMobileFilterOpen(false); }}
                                    className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-gray-400"
                                >
                                    Reset All
                                </button>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="flex-[2] bg-[#702540] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl"
                                >
                                    Show Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
