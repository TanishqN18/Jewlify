import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/Users';

export async function POST(req) {
  const body = await req.json();

  await dbConnect();

  let user = await User.findOne({ clerkId: body.clerkId });

  if (!user) {
    user = await User.create({
      clerkId: body.clerkId,
      email: body.email,
      name: body.name || '',
      image: body.image || '',
      createdAt: new Date(),
    });
  }

  return new Response(JSON.stringify(user), { status: 200 });
}
