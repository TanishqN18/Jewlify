'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';
import { auth } from './firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import JewelifyLoader from '../components/JewelifyLoader';

export default function withAuth(Component) {
  return function ProtectedPage(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
          toast.warning('Please login to access this page');
          router.push(`/login?redirect=${pathname}`);
        } else {
          setUser(currentUser);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [router, pathname]);

   if (loading) return <LoadingSpinner text="Checking login..." />;
    if (!user) return null;
if (loading) return <JewelifyLoader />;

    return <Component {...props} user={user} />;
  };
}
