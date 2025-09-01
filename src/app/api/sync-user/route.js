// app/api/syncUser/route.js (App Router)
import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/Users';

export async function GET(req) {
  try {
    await dbConnect();
    const user = await currentUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    const existingUser = await User.findOne({ clerkId: user.id });

    if (!existingUser) {
      const newUser = await User.create({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.firstName + ' ' + user.lastName,
      });

      return new Response(JSON.stringify({ status: 'created', user: newUser }), { status: 201 });
    }

    return new Response(JSON.stringify({ status: 'exists', user: existingUser }), { status: 200 });
  } catch (error) {
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
