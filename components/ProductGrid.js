'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCard from './ProductCard';
import useFilterStore from './store/FilterStore';

export default function ProductGrid({ allProducts = [] }) {
  const { category, priceRange } = useFilterStore();
  const [filtered, setFiltered] = useState(allProducts);
  const [isFiltering, setIsFiltering] = useState(false);

  // Progressive reveal
  const [visible, setVisible] = useState(12);

  // Normalize priceRange as {min,max}
  const normalizedRange = useMemo(() => {
    if (!priceRange) return { min: 0, max: Infinity };
    if (Array.isArray(priceRange)) return { min: priceRange[0] ?? 0, max: priceRange[1] ?? Infinity };
    return { min: priceRange.min ?? 0, max: priceRange.max ?? Infinity };
  }, [priceRange]);

  // Filtering logic (keeps your data as-is)
  useEffect(() => {
    setIsFiltering(true);

    const t = setTimeout(() => {
      const next = (allProducts || []).filter((p) => {
        const inCategory =
          !category || category === 'All' || p?.category === category || (Array.isArray(p?.categories) && p.categories.includes(category));
        const price = typeof p?.price === 'number' ? p.price : Number(p?.price || 0);
        const inPrice = price >= normalizedRange.min && price <= normalizedRange.max;
        return inCategory && inPrice;
      });

      setFiltered(next);
      setVisible(12); // reset pagination after filtering
      setIsFiltering(false);
    }, 150); // tiny debounce for smooth skeletons

    return () => clearTimeout(t);
  }, [category, normalizedRange.min, normalizedRange.max, allProducts]);

  // Animations
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 240, damping: 22 } },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.15 } },
  };

  const toRender = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-primary">Our Collection</h2>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/50 border border-white/10 text-secondary">
            {filtered.length} items
          </span>
          {category && category !== 'All' && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gold/15 border border-gold/40 text-gold">
              {category}
            </span>
          )}
          {(Number.isFinite(normalizedRange.min) || Number.isFinite(normalizedRange.max)) && priceRange && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 border border-white/10 text-secondary">
              Price: {normalizedRange.min} - {Number.isFinite(normalizedRange.max) ? normalizedRange.max : '∞'}
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {isFiltering ? (
          <motion.div
            key="skeleton"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="show"
            variants={container}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div key={i} variants={item} className="rounded-2xl border border-white/10 bg-secondary overflow-hidden">
                <div className="h-56 md:h-64 lg:h-72 w-full bg-white/5 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-white/10 rounded w-1/3 animate-pulse" />
                  <div className="h-8 bg-white/10 rounded w-1/2 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : filtered.length ? (
          <div key="grid">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              layout
              initial="hidden"
              animate="show"
              variants={container}
            >
              {toRender.map((p) => {
                // Format the image URL for Cloudinary
                const cloudinaryBaseUrl = 'https://res.cloudinary.com/your-cloud-name/image/upload/'; // Replace with your Cloudinary base URL
                const formattedImage = p.coverImage ? `${cloudinaryBaseUrl}${p.coverImage}` : '/placeholder.png'; // Fallback to placeholder

                return (
                  <motion.div key={p._id} layout variants={item}>
                    <ProductCard product={{ ...p, coverImage: formattedImage }} showBadge={Boolean(p?.featured)} />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Load more */}
            {canLoadMore && (
              <div className="mt-8 flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -1 }}
                  onClick={() => setVisible((v) => v + 12)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Load more
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-secondary p-10 text-center"
          >
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gold/20 text-gold grid place-items-center text-xl">✨</div>
            <h3 className="text-primary font-semibold">No products found</h3>
            <p className="text-secondary text-sm mt-1">Try changing filters or clearing the price range.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

