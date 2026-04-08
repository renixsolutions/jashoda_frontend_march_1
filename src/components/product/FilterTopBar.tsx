"use client";

import React from "react";
import { ChevronDown, Filter, X, Plus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useNavigation } from "@/contexts/NavigationContext";

interface FilterPillProps {
    label: string;
    onRemove?: () => void;
    active?: boolean;
}

const FilterPill = ({ label, onRemove, active }: FilterPillProps) => (
    <button
        onClick={onRemove}
        className={`
      flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border
      ${active
                ? "bg-[#832729] text-white border-[#832729] hover:bg-[#6b1f21]"
                : "bg-white text-[#404040] border-[#E0E0E0] hover:border-[#832729] hover:text-[#832729]"
            }
    `}
    >
        {label}
        {active ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 opacity-50" />}
    </button>
);

export default function FilterTopBar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { categories, genders, occasions } = useNavigation();

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
        activeFilters.push({ key: 'price', label: `Price: ₹${Number(min).toLocaleString()} - ₹${Number(max).toLocaleString()}` });
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

    return (
        <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar border-b border-[#E0E0E0] p-1">
            <button 
                onClick={clearAll}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#832729] text-white text-sm font-medium hover:bg-[#6b1f21] transition-colors mr-2 shadow-md shrink-0"
            >
                <Filter className="w-4 h-4" />
                All
            </button>

            {/* Active Filter Pills */}
            {activeFilters.map((filter) => (
                <FilterPill 
                    key={filter.key} 
                    label={filter.label} 
                    active 
                    onRemove={() => removeFilter(filter.key)} 
                />
            ))}

            {/* Inactive suggestions */}
            {activeFilters.length < 5 && suggestions.map((s) => (
               <button
                  key={s.label}
                  onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set(s.key, s.value);
                        router.push(`/shop?${params.toString()}`);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white text-[#404040] border border-[#E0E0E0] hover:border-[#832729] hover:text-[#832729] transition-all shrink-0"
               >
                  {s.label}
                  <ChevronDown className="w-3 h-3 opacity-50" />
               </button>
            ))}

            {activeFilters.length > 0 && (
                <button 
                    onClick={clearAll}
                    className="text-xs text-[#832729] font-medium hover:underline ml-2 uppercase tracking-wider shrink-0"
                >
                    Clear All
                </button>
            )}
        </div>
    );
}
