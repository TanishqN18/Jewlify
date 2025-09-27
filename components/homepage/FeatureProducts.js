'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard';
import Link from 'next/link';

export default function FeaturedProducts({ products = [] }) {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    // Mark top 4 products as featured
    if (products.length > 0) {
      setFeatured(products.slice(0, 4));
    }
  }, [products]);

  if (featured.length === 0) {
    return (
      <section className="py-16 px-4 bg-secondary transition-all duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary rounded-lg w-64 mx-auto mb-8 opacity-50"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-secondary rounded-2xl opacity-50"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-secondary transition-all duration-300 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200/20 dark:bg-yellow-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-300/20 dark:bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">✨ Featured </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700">
              Jewellery
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-secondary max-w-2xl mx-auto text-lg"
          >
            Handpicked premium pieces that showcase exceptional craftsmanship and timeless elegance
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {featured.map((item, index) => (
            <motion.div
              key={item._id || item.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <ProductCard 
                product={item} 
                showBadge={index === 0} 
              />
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {(
            [
              { number: '10K+', label: 'Happy Customers', icon: '😊' },
              { number: '500+', label: 'Premium Designs', icon: '💎' },
              { number: '99%', label: 'Satisfaction Rate', icon: '⭐' },
              { number: '24/7', label: 'Customer Support', icon: '🛟' }
            ]
          ).map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-primary backdrop-blur-sm rounded-2xl border border-yellow-200 dark:border-yellow-600/30 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-secondary font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
        </motion.div>
      </div>
    </section>
  );
}
