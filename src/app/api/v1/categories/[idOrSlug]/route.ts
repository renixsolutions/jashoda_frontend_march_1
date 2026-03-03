
import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES, PRODUCTS } from '@/lib/mockData';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ idOrSlug: string }> }
) {
    const { idOrSlug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let category;
    const isNumeric = /^\d+$/.test(idOrSlug as string);

    if (isNumeric) {
        category = CATEGORIES.find(c => c.id === parseInt(idOrSlug));
    } else {
        category = CATEGORIES.find(c => c.slug === idOrSlug);
    }

    if (!category) {
        return NextResponse.json(
            { success: false, message: "Category not found" },
            { status: 404 }
        );
    }

    // Fetch products for this category
    // Matches if category name matches OR categoryId matches
    const categoryProducts = PRODUCTS.filter(p =>
        p.categoryId === category!.id ||
        p.category.toLowerCase() === category!.name.toLowerCase() ||
        p.subcategoryId === category!.id ||
        p.subcategory?.toLowerCase() === category!.name.toLowerCase()
    );

    // Pagination for products
    const total = categoryProducts.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedProducts = categoryProducts.slice(offset, offset + limit);

    return NextResponse.json({
        success: true,
        message: "Category with products fetched successfully",
        data: {
            category,
            products: paginatedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }
    });
}
