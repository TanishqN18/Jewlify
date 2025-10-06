import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/Users';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    // Build filter object
    let filter = {};
    if (role && role !== 'all') filter.role = role;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { 
      clerkId, 
      firstName, 
      lastName, 
      email, 
      phone, 
      dob, 
      gender, 
      image, 
      role = 'customer',
      addresses = [],
      paymentMethods = []
    } = body;

    // Validate required fields
    if (!clerkId || !email) {
      return NextResponse.json(
        { success: false, message: 'ClerkId and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ clerkId }, { email }] 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this clerkId or email already exists' },
        { status: 400 }
      );
    }

    // Validate addresses if provided
    if (addresses && addresses.length > 0) {
      for (const address of addresses) {
        if (!address.line1 || !address.city || !address.state || !address.zip) {
          return NextResponse.json(
            { success: false, message: 'Address must include line1, city, state, and zip' },
            { status: 400 }
          );
        }
      }
    }

    // Validate payment methods if provided
    if (paymentMethods && paymentMethods.length > 0) {
      for (const payment of paymentMethods) {
        if (!payment.cardType || !payment.last4 || !payment.expiry) {
          return NextResponse.json(
            { success: false, message: 'Payment method must include cardType, last4, and expiry' },
            { status: 400 }
          );
        }
      }
    }

    // Create new user
    const user = await User.create({
      clerkId,
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      image,
      role,
      addresses,
      paymentMethods
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'User with this clerkId already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}