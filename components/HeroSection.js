'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#fff8e1] via-[#fff1c1] to-[#fbe8a6] dark:from-[#1a1a1a] dark:via-[#0f0f0f] dark:to-[#000000] py-14 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-800 dark:text-yellow-300 leading-tight">
            Discover Timeless Elegance <br />
            with <span className="text-yellow-600 dark:text-yellow-400">Jewelify</span>
          </h1>

          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg max-w-md">
            Handcrafted premium jewellery to elevate every moment—rings, necklaces, bangles and more.
          </p>

          <div className="flex flex-wrap gap-2 md:gap-3">
            {['100% Hallmarked Gold', 'Free Shipping', 'COD Available'].map((tag, i) => (
              <span
                key={i}
                className="bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-200 text-yellow-700 text-xs md:text-sm px-3 py-1 rounded-full font-medium shadow-sm hover:shadow-md transition"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
            >
              Shop Now
            </motion.button>
          </Link>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl shadow-xl overflow-hidden"
          >
            <Image
              src="/Images/Main.jpg"
              alt="Elegant Jewellery Display"
              width={460}
              height={460}
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
