'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ThankYouPage() {
  const router = useRouter();

  // Optional: Redirect to /shop after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/shop');
    }, 5000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <motion.div
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Thank You for Your Order!
      </motion.h1>
      <motion.p
        className="text-lg text-gray-600 dark:text-gray-300 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        A confirmation email has been sent. You’ll be redirected shortly.
      </motion.p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/shop')}
        className="px-6 py-3 rounded bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-90 transition"
      >
        Continue Shopping
      </motion.button>
    </motion.div>
  );
}
