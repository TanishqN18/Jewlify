'use client';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

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
    setShowAll(false); // reset view when category changes
  }, [active, products]);

  const visibleProducts = showAll ? filtered : filtered.slice(0, 8);

  return (
    <div
      id="categories"
      className="px-4 py-8 md:py-12 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-neutral-900 dark:via-black dark:to-neutral-800 transition-colors duration-500"
    >
      <h2 className="text-center text-2xl md:text-3xl font-semibold mb-6 text-neutral-800 dark:text-white">
        Shop by Category
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2.5 rounded-full border transition-all duration-300 text-sm font-medium shadow-sm
              ${
                active === cat
                  ? 'bg-yellow-500 text-white border-yellow-500 shadow-md scale-105'
                  : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-neutral-600 hover:bg-yellow-100 dark:hover:bg-neutral-700'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Show All / Less Button */}
      {filtered.length > 8 && !showAll && (
      <div className="flex justify-center mt-6">
        <a
          href="/shop"
          className="inline-block px-6 py-2 rounded-full bg-transparent border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition duration-300"
        >
          View All Products
        </a>
      </div>
    )}
    </div>
  );
}
