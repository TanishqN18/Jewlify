import dbConnect from '../../../../../lib/dbConnect';
import User from '../../../../../models/Users';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req) {
  const body = await req.json();
  await dbConnect();

  const clerkUser = await currentUser();

  let user = await User.findOne({ clerkId: body.clerkId });

  if (!user) {
    user = await User.create({
      clerkId: body.clerkId,
      email: body.email || clerkUser?.primaryEmailAddress?.emailAddress || '',
      name: body.name || clerkUser?.fullName || '',
      profileImage: body.image || clerkUser?.imageUrl || '',
      createdAt: new Date(),
    });
  } else {
    // Allow updating from request body
    if (body.name) user.name = body.name;
    if (body.email) user.email = body.email;
    if (body.image) user.profileImage = body.image;

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

  return new Response(JSON.stringify(user), { status: 200 });
}
