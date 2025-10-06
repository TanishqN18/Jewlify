import { NextResponse } from 'next/server';
import dbConnect from '../../../../../../lib/dbConnect';
import Rate from '../../../../../../models/rate';

// GET - Fetch rate history
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    
    const skip = (page - 1) * limit;
    
    const rates = await Rate.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Rate.countDocuments();
    
    return NextResponse.json({
      success: true,
      rates,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRates: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Rate history fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rate history' },
      { status: 500 }
    );
  }
}