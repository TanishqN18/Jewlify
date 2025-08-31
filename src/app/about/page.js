'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-12 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-4xl font-bold text-yellow-500 mb-6 text-center">About Jewelify</h1>

      <p className="text-lg leading-relaxed mb-6">
        At <span className="font-semibold">Jewelify</span>, we blend timeless craftsmanship with modern design to bring you jewellery that is not just worn, but cherished.
        We offer a curated selection of handcrafted pieces—from sparkling rings to graceful necklaces—made for every occasion and every story.
      </p>

      <p className="text-lg leading-relaxed mb-6">
        Our goal is to make luxury accessible and your shopping experience seamless. With a strong focus on customer satisfaction, we ensure every item you receive is as elegant and flawless as you imagined.
      </p>

      <p className="text-lg leading-relaxed mb-6">
        Whether you are shopping for a celebration or a meaningful gift, Jewelify promises trust, quality, and sparkle in every box.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="p-6 border rounded-md bg-white dark:bg-gray-800 shadow">
          <h2 className="text-xl font-semibold mb-2 text-yellow-600">🌟 Our Mission</h2>
          <p>To deliver elegant, affordable jewellery that inspires confidence and celebrates individuality.</p>
        </div>
        <div className="p-6 border rounded-md bg-white dark:bg-gray-800 shadow">
          <h2 className="text-xl font-semibold mb-2 text-yellow-600">🤝 Our Promise</h2>
          <p>Crafted with care, delivered with trust. Every product passes through rigorous quality checks before it reaches you.</p>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        Thank you for choosing Jewelify ✨
      </div>
    </motion.div>
  );
}
