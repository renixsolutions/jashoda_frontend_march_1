
import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/mockData';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ parentId: string }> }
) {
    const { parentId: parentIdStr } = await params;
    const parentId = parseInt(parentIdStr);

    if (isNaN(parentId)) {
        return NextResponse.json(
            { success: false, message: "Invalid Parent ID" },
            { status: 400 }
        );
    }

    const subcategories = CATEGORIES.filter(c => c.parentId === parentId && c.status === 'active');

    return NextResponse.json({
        success: true,
        message: "Subcategories fetched successfully",
        data: subcategories
    });
}
