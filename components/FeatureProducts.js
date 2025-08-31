'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import products from '../lib/products';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    // Mark top 4 products as featured
    setFeatured(products.slice(0, 4));
  }, []);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#fff9e6] to-[#fef5c3] dark:from-[#1a1a1a] dark:to-[#000000] transition-colors duration-500">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-yellow-800 dark:text-yellow-200 mb-10"
        >
          ✨ Featured Jewellery
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={item} showBadge={index === 0} />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10">
          <Link href="/shop">
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-md shadow-md transition-all hover:scale-105 dark:bg-yellow-500 dark:hover:bg-yellow-400">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
