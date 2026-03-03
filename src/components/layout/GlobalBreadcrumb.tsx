"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function GlobalBreadcrumb() {
    const pathname = usePathname();

    // Do not show on home page
    if (pathname === "/") return null;

    // Split pathname into segments
    const segments = pathname.split('/').filter(Boolean);

    // Generate breadcrumbs
    const breadcrumbs = segments.map((segment, index) => {
        let href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;

        // Format segment name: replace hyphens with spaces, uppercase
        let name = segment.replace(/-/g, ' ').toUpperCase();

        // Handle specific segments
        if (segment === 'product') {
            name = 'SHOP';
            href = '/shop';
        }

        return { name, href, isLast };
    });

    return (
        <div className="bg-[#fcf8f5] mt-20 md:mt-32 py-4 border-b border-[#ebdacc]">
            <div className="container mx-auto px-6 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-[#832729]/60 uppercase">
                    <Link href="/" className="hover:text-[#832729] transition-colors">HOME</Link>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.href}>
                            <span className="text-[#832729]/40">/</span>
                            {crumb.isLast ? (
                                <span className="text-[#832729]">{crumb.name}</span>
                            ) : (
                                <Link href={crumb.href} className="hover:text-[#832729] transition-colors">
                                    {crumb.name}
                                </Link>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
