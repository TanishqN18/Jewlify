import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/Users';
import ClientDashboard from '../../../components/account/ClientDashboard';

export default async function AccountPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-xl">
        Please log in to access your account.
      </div>
    );
  }

  await dbConnect();

  // Try finding user in MongoDB, if not exists — create one
  let userData = await User.findOne({ clerkId: clerkUser.id });

  if (!userData) {
    userData = await User.create({
      clerkId: clerkUser.id,
      name: clerkUser.firstName || '',
      email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
      profileImage: clerkUser.imageUrl || '',
    });
  }

  return <ClientDashboard />;
}
