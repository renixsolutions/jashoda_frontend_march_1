
import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/mockData';

export async function GET() {
    const parents = CATEGORIES.filter(c => c.parentId === null);

    return NextResponse.json({
        success: true,
        message: "Parent categories fetched successfully",
        data: parents
    });
}
