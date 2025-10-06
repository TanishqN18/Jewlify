import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Rate from '../../../../../models/rate';

// GET - Fetch current active rates
export async function GET() {
  try {
    await dbConnect();
    
    const currentRate = await Rate.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!currentRate) {
      // Create default rates if none exist
      const defaultRate = new Rate({
        goldRate: 6500, // Default gold rate
        silverRate: 80,  // Default silver rate
        updatedBy: 'System',
        notes: 'Default rates initialized'
      });
      await defaultRate.save();
      
      return NextResponse.json({
        success: true,
        rates: defaultRate
      });
    }
    
    return NextResponse.json({
      success: true,
      rates: currentRate
    });
    
  } catch (error) {
    console.error('Rates fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rates' },
      { status: 500 }
    );
  }
}

// POST - Update rates
export async function POST(request) {
  try {
    await dbConnect();
    
    const { goldRate, silverRate, updatedBy, notes } = await request.json();
    
    // Validation
    if (!goldRate || !silverRate || goldRate < 0 || silverRate < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid rate values' },
        { status: 400 }
      );
    }
    
    if (!updatedBy) {
      return NextResponse.json(
        { success: false, error: 'updatedBy field is required' },
        { status: 400 }
      );
    }
    
    const rate = new Rate({
      goldRate: parseFloat(goldRate),
      silverRate: parseFloat(silverRate),
      updatedBy,
      notes: notes || '',
      isActive: true
    });
    
    await rate.save();
    
    return NextResponse.json({
      success: true,
      message: 'Rates updated successfully',
      rates: rate
    });
    
  } catch (error) {
    console.error('Rates update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update rates' },
      { status: 500 }
    );
  }
}