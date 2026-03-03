import React from "react";
import { ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "BIS HALLMARKED",
        subtitle: "100% Pure & Authenticated",
    },
    {
        icon: Truck,
        title: "FREE SHIPPING",
        subtitle: "On all orders above ₹4,999",
    },
    {
        icon: RotateCcw,
        title: "15 DAYS RETURN",
        subtitle: "No questions asked policy",
    },
    {
        icon: Award,
        title: "LIFETIME PLATING",
        subtitle: "Complimentary polish service",
    },
];

export default function BenefitsStrip() {
    return (
        <section className="py-12 bg-white/50 backdrop-blur-sm border-y border-white/20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center gap-3 group"
                        >
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon strokeWidth={1.5} size={28} />
                            </div>
                            <h3 className="text-sm font-bold tracking-wider text-blue-900 uppercase">
                                {feature.title}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium">
                                {feature.subtitle}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
