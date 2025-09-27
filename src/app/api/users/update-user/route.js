import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/Users';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
    const body = await req.json();
    await dbConnect();

    const clerkUser = await currentUser();
    
    // Get clerkId from body or current user
    const clerkId = body.clerkId || clerkUser?.id;
    
    if (!clerkId) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { 
        status: 401 
      });
    }

    let user = await User.findOne({ clerkId: clerkId });

    if (!user) {
      user = await User.create({
        clerkId: clerkId,
        email: body.email || clerkUser?.primaryEmailAddress?.emailAddress || '',
        name: body.name || clerkUser?.fullName || '',
        profileImage: body.image || clerkUser?.imageUrl || '',
        phone: body.phone || '',
        gender: body.gender || '',
        dob: body.dob || null,
        createdAt: new Date(),
      });
    } else {
      // Allow updating from request body
      if (body.name !== undefined) user.name = body.name;
      if (body.email !== undefined) user.email = body.email;
      if (body.image !== undefined) user.profileImage = body.image;
      if (body.phone !== undefined) user.phone = body.phone;
      if (body.gender !== undefined) user.gender = body.gender;
      if (body.dob !== undefined) user.dob = body.dob;
      if (body.addresses !== undefined) user.addresses = body.addresses;

      // Ensure Clerk's data fills any missing gaps
      if (!user.name && clerkUser?.fullName) user.name = clerkUser.fullName;
      if (!user.email && clerkUser?.primaryEmailAddress?.emailAddress) {
        user.email = clerkUser.primaryEmailAddress.emailAddress;
      }
      if (!user.profileImage && clerkUser?.imageUrl) {
        user.profileImage = clerkUser.imageUrl;
      }

      await user.save();
    }

    return new Response(JSON.stringify({ success: true, user }), { 
      status: 200 
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update user', 
      details: error.message 
    }), { 
      status: 500 
    });
  }
}

// Add PUT handler for consistency
export async function PUT(req) {
  return POST(req);
}
