'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../ProductCard';

const categories = ['All', 'Necklaces', 'Rings', 'Earrings', 'Bracelets'];

export default function CategoryTabs({ products }) {
  const [active, setActive] = useState('All');
  const [filtered, setFiltered] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const filteredData =
      active === 'All'
        ? products
        : products.filter((p) => p.category === active);

    setFiltered(filteredData);
    setShowAll(false);
  }, [active, products]);

  const visibleProducts = showAll ? filtered : filtered.slice(0, 8);

  return (
    <section
      id="categories"
      className="px-4 py-12 md:py-16 bg-secondary transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Category</span>
          </h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Discover our curated collection of premium jewellery across different categories
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActive(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-6 py-3 rounded-full border-2 font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                active === cat
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-500'
                  : 'bg-primary text-primary border-gray-200 dark:border-gray-600 hover:bg-yellow-50 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <p className="text-secondary">
            Showing {visibleProducts.length} of {filtered.length} products
            {active !== 'All' && (
              <span className="ml-2 text-yellow-600 dark:text-yellow-400 font-medium">
                in {active}
              </span>
            )}
          </p>
        </motion.div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12"
          >
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4 opacity-50">💎</div>
                <p className="text-secondary text-lg text-center">
                  No products found in this category.
                </p>
                <p className="text-secondary text-sm text-center mt-2 opacity-75">
                  Try selecting a different category or check back later.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All Button */}
        {filtered.length > 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.a
              href="/shop"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>View All Products</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
