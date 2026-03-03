
import { NextResponse } from 'next/server';
import { GENDERS } from '@/lib/mockData';

export async function GET() {
    return NextResponse.json({
        success: true,
        message: "Genders fetched successfully",
        data: GENDERS
    });
}
