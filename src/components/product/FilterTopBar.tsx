import React from "react";
import { ChevronDown, Filter, Plus } from "lucide-react";

interface FilterPillProps {
    label: string;
    active?: boolean;
}

const FilterPill = ({ label, active }: FilterPillProps) => (
    <button
        className={`
      flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border
      ${active
                ? "bg-[#832729] text-white border-[#832729]"
                : "bg-white text-[#404040] border-[#E0E0E0] hover:border-[#832729] hover:text-[#832729]"
            }
    `}
    >
        {active && <Plus className="w-3 h-3 rotate-45" />}
        {label}
        {!active && <ChevronDown className="w-3 h-3 opacity-50" />}
    </button>
);

export default function FilterTopBar() {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar border-b border-[#E0E0E0] p-1">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#832729] text-white text-sm font-medium hover:bg-[#6b1f21] transition-colors mr-2 shadow-md">
                <Filter className="w-4 h-4" />
                Filter
            </button>

            <FilterPill label="Price: ₹25,000 - ₹50,000" />
            <FilterPill label="Gifts For Him" />
            <FilterPill label="Women" />
            <FilterPill label="Gold Jewellery" />

            <button className="text-xs text-[#832729] font-medium hover:underline ml-2 uppercase tracking-wider">
                + Show More
            </button>
        </div>
    );
}
