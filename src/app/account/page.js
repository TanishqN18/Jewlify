import { currentUser } from '@clerk/nextjs/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/Users';
import Order from '../../../models/Order';
import ClientDashboard from '../../../components/account/ClientDashboard';

export default async function AccountPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-primary text-xl">
        Please log in to access your account.
      </div>
    );
  }

  await dbConnect();

  // Find or create user in MongoDB
  let userData = await User.findOne({ clerkId: clerkUser.id });
  if (!userData) {
    userData = await User.create({
      clerkId: clerkUser.id,
      name: clerkUser.firstName || '',
      email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
      profileImage: clerkUser.imageUrl || '',
    });
  }

  // Fetch orders for this user
  const orders = await Order.find({ userId: userData._id }).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-primary">
      <ClientDashboard
      />
    </div>
  );
}
