
import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/mockData';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || 'active';
    const search = searchParams.get('search')?.toLowerCase();
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    let filteredCategories = [...CATEGORIES];

    // Filtering
    if (status) {
        filteredCategories = filteredCategories.filter(c => c.status === status);
    }
    if (search) {
        filteredCategories = filteredCategories.filter(c => c.name.toLowerCase().includes(search));
    }

    // Sorting
    filteredCategories.sort((a, b) => {
        let valA: any = a[sortBy as keyof typeof a];
        let valB: any = b[sortBy as keyof typeof b];

        if (sortBy === 'created_at') {
            valA = a.createdAt;
            valB = b.createdAt;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination
    const total = filteredCategories.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedCategories = filteredCategories.slice(offset, offset + limit);

    return NextResponse.json({
        success: true,
        message: "Categories fetched successfully",
        data: paginatedCategories,
        meta: {
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }
    });
}
