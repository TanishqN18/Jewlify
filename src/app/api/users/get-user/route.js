import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/Users';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req) {
  try {
    await dbConnect();
    const { userId } = getAuth(req);


    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
        name: '',
        email: '',
        profileImage: '',
        addresses: [],
        createdAt: new Date(),
      });
    } else if (!user.addresses) {
      user.addresses = [];
      await user.save();
    }


    return NextResponse.json({ 
      user: {
        ...user.toObject(),
        addresses: user.addresses || []
      }
    });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
