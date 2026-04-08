"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/contexts/NavigationContext";

export default function GlobalBreadcrumb() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { categories, genders, occasions } = useNavigation();
    const [productName, setProductName] = React.useState<string | null>(null);

    // Fetch product name if on product page
    React.useEffect(() => {
        const segments = pathname.split('/').filter(Boolean);
        if (segments[0] === 'product' && segments[1]) {
            const fetchProductName = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/products/${segments[1]}`);
                    if (res.ok) {
                        const json = await res.json();
                        setProductName(json.data.name);
                    }
                } catch (e) {
                    console.error("Failed to fetch product name for breadcrumb", e);
                }
            };
            fetchProductName();
        } else {
            setProductName(null);
        }
    }, [pathname]);

    // Do not show on home page
    if (pathname === "/") return null;

    // Split pathname into segments
    const segments = pathname.split('/').filter(Boolean);

    // Generate breadcrumbs
    let breadcrumbs = segments.map((segment, index) => {
        let href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1 && !searchParams.toString();

        // Format segment name: replace hyphens with spaces, uppercase
        let name = segment.replace(/-/g, ' ').toUpperCase();

        // Handle specific segments
        if (segment === 'product') {
            name = 'SHOP';
            href = '/shop';
        }

        // If this is the product ID segment, use the fetched product name
        if (index === 1 && segments[0] === 'product' && productName) {
            name = productName.toUpperCase();
        }

        return { name, href, isLast };
    });

    // Add segments from query parameters if on shop page
    if (pathname === '/shop' || pathname === '/product') {
        const categoryId = searchParams.get('category');
        const subcategoryId = searchParams.get('subcategory');
        const occasionId = searchParams.get('occasion');
        const genderId = searchParams.get('gender');
        const search = searchParams.get('search');

        if (genderId) {
            const gender = genders.find(g => String(g.id) === genderId || g.name.toLowerCase() === genderId.toLowerCase());
            breadcrumbs.push({
                name: (gender ? gender.name : genderId).toUpperCase(),
                href: `/shop?gender=${genderId}`,
                isLast: !categoryId && !subcategoryId && !occasionId && !search
            });
        }
        if (occasionId) {
            const occasion = occasions.find(o => String(o.id) === occasionId || o.slug === occasionId);
            breadcrumbs.push({
                name: (occasion ? occasion.name : occasionId).toUpperCase(),
                href: `/shop?occasion=${occasionId}`,
                isLast: !categoryId && !subcategoryId && !search
            });
        }
        if (categoryId) {
            const category = categories.find(c => String(c.id) === categoryId || c.slug === categoryId);
            breadcrumbs.push({
                name: (category ? category.name : categoryId).toUpperCase(),
                href: `/shop?category=${categoryId}`,
                isLast: !subcategoryId && !search
            });
        }
        if (subcategoryId) {
            // Find in subcategories if needed, but for now we look in all categories
            const subcategory = categories.find(c => String(c.id) === subcategoryId || c.slug === subcategoryId);
            breadcrumbs.push({
                name: (subcategory ? subcategory.name : subcategoryId).toUpperCase(),
                href: `/shop?subcategory=${subcategoryId}`,
                isLast: !search
            });
        }
        if (search) {
            breadcrumbs.push({
                name: `SEARCH: ${search.toUpperCase()}`,
                href: `/shop?search=${search}`,
                isLast: true
            });
        }
    }

    // Ensure the last breadcrumb is marked as last
    if (breadcrumbs.length > 0) {
        breadcrumbs[breadcrumbs.length - 1].isLast = true;
    }

    return (
        <div className="bg-[#fcf8f5] mt-[116px] md:mt-[165px] py-2 md:py-4 border-b border-[#ebdacc]">
            <div className="container mx-auto px-6 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-[#832729]/60 uppercase">
                    <Link href="/" className="hover:text-[#832729] transition-colors">HOME</Link>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
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
