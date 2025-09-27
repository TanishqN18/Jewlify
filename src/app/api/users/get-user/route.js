import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/Users';
import { getAuth, currentUser } from '@clerk/nextjs/server';

export async function GET(req) {
  try {
    await dbConnect();
    const { userId } = getAuth(req);


    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await currentUser();

    let user = await User.findOne({ clerkId: userId });

    // If user not found, create one from Clerk data
    if (!user) {
      user = await User.create({
        clerkId: userId,
        name: clerkUser?.fullName || 'User',
        email: clerkUser?.primaryEmailAddress?.emailAddress || '',
        profileImage: clerkUser?.imageUrl || '',
        addresses: [], // Initialize empty addresses array
        createdAt: new Date(),
      });
    } else {
      // Fill in any missing data from Clerk
      let updated = false;
      if (!user.name && clerkUser?.fullName) {
        user.name = clerkUser.fullName;
        updated = true;
      }
      if (!user.email && clerkUser?.primaryEmailAddress?.emailAddress) {
        user.email = clerkUser.primaryEmailAddress.emailAddress;
        updated = true;
      }
      if (!user.profileImage && clerkUser?.imageUrl) {
        user.profileImage = clerkUser.imageUrl;
        updated = true;
      }
      // Ensure addresses array exists
      if (!user.addresses) {
        user.addresses = [];
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }


    // Return in the format expected by AddressBook component
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
