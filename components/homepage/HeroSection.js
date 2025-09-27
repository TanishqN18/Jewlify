'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight, FaShippingFast, FaCertificate, FaMoneyBillWave, FaStar } from 'react-icons/fa';

export default function Hero() {
  const features = [
    { icon: FaCertificate, text: '100% Hallmarked Gold' },
    { icon: FaShippingFast, text: 'Free Shipping' },
    { icon: FaMoneyBillWave, text: 'COD Available' }
  ];

  return (
    <section className="relative bg-primary py-16 lg:py-20 transition-all duration-500 overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200/20 dark:bg-yellow-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-yellow-300/20 dark:bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm font-medium border border-yellow-200 dark:border-yellow-700 transition-all duration-300"
            >
              <FaStar className="text-yellow-500 dark:text-yellow-400" />
              <span>Premium Jewellery Collection</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
              >
                <span className="text-primary">Discover</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700">
                  Timeless
                </span>
                <br />
                <span className="text-primary">Elegance</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-secondary max-w-lg leading-relaxed"
              >
                Handcrafted premium jewellery to elevate every moment. Discover our exquisite collection of rings, necklaces, bangles and more.
              </motion.p>
            </div>

            {/* Feature Tags */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 bg-secondary backdrop-blur-sm border border-yellow-200 dark:border-yellow-600/30 text-primary px-4 py-2 rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <feature.icon className="text-sm text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300"
                >
                  Shop Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-3 bg-transparent border-2 border-yellow-500 dark:border-yellow-400 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500 hover:text-white dark:hover:bg-yellow-400 dark:hover:text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-secondary">10K+ Happy Customers</span>
              </div>
              
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ))}
                <span className="text-sm text-secondary ml-1">4.9/5 Rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <motion.div
              whileHover={{ scale: 1.02, rotate: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Decorative rings around image */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl rotate-3 scale-105 opacity-20 blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-l from-yellow-300 via-yellow-400 to-yellow-500 rounded-3xl -rotate-2 scale-110 opacity-10 blur-md" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-primary p-2 transition-all duration-300">
                <Image
                  src="/Images/Main.jpg"
                  alt="Elegant Jewellery Display"
                  width={500}
                  height={500}
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
              >
                💎
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
              >
                ✨
              </motion.div>

              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                className="absolute top-1/2 -left-8 w-8 h-8 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center text-yellow-800 text-sm shadow-md"
              >
                🏆
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
