import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/Users';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
    await dbConnect();

    const { userId } = getAuth(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json();
    const clerkId = body.clerkId || userId;

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email: body.email || '',
        name: body.name || '',
        profileImage: body.image || '',
        phone: body.phone || '',
        gender: body.gender || '',
        dob: body.dob || null,
        addresses: body.addresses || [],
        createdAt: new Date(),
      });
    } else {
      if (body.name !== undefined) user.name = body.name;
      if (body.email !== undefined) user.email = body.email;
      if (body.image !== undefined) user.profileImage = body.image;
      if (body.phone !== undefined) user.phone = body.phone;
      if (body.gender !== undefined) user.gender = body.gender;
      if (body.dob !== undefined) user.dob = body.dob;
      if (body.addresses !== undefined) user.addresses = body.addresses;

      await user.save();
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Update user error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

// Allow PUT to reuse the same logic
export async function PUT(req) {
  return POST(req);
}
