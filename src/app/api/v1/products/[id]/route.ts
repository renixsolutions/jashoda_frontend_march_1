
import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/mockData';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // We can't easily distinguish ID vs Slug unless we check if it's numeric.
    // The previous prompt said: "If numeric -> treated as ID, If string -> treated as slug"

    const idOrSlug = id; // The folder name is [id], so the param key is 'id'

    const isNumeric = /^\d+$/.test(idOrSlug as string);

    let product;

    if (isNumeric) {
        product = PRODUCTS.find(p => p.id === idOrSlug);
    } else {
        product = PRODUCTS.find(p => p.slug === idOrSlug);
    }

    if (!product) {
        return NextResponse.json(
            { success: false, message: "Resource not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({
        success: true,
        message: "Product fetched successfully",
        data: product
    });
}
