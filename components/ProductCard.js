'use client';

import { useMemo, useState } from 'react';
import useCartStore from '../components/store/cartStore';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product, showBadge = false }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  // Safe image handling (array or string)
  const primaryImg = Array.isArray(product?.image) ? product.image[0] : product?.image;
  const hoverImg = Array.isArray(product?.image) && product.image[1] ? product.image[1] : primaryImg;

  // Ensure images are from Cloudinary or a fallback
  const cloudinaryBaseUrl = 'https://res.cloudinary.com/your-cloud-name/image/upload/'; // Replace with your Cloudinary base URL
  const formattedPrimaryImg = primaryImg ? `${cloudinaryBaseUrl}${primaryImg}` : '/fallback.png';
  const formattedHoverImg = hoverImg ? `${cloudinaryBaseUrl}${hoverImg}` : formattedPrimaryImg;

  // Stable currency formatting
  const inr = useMemo(() => new Intl.NumberFormat('en-IN'), []);
  const priceNum = typeof product?.price === 'number' ? product.price : Number(product?.price || 0);

  const handleCardClick = () => router.push(`/product/${product._id}`);

  // Modern card variants with subtle animations
  const cardVariants = {
    initial: { y: 0, scale: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    hover: {
      y: -6,
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className="relative group overflow-hidden rounded-3xl bg-primary border border-secondary/10 hover:border-accent/20 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-sm"
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Featured Badge */}
      {showBadge && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-accent to-accent/80 text-primary px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm border border-white/20">
          ✨ Featured
        </div>
      )}

      {/* Product Image (crossfade on hover) */}
      <div className="relative w-full h-56 md:h-64 lg:h-72 overflow-hidden">
        {/* Base image */}
        <Image
          src={formattedPrimaryImg}
          alt={product?.name || 'Product'}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          priority={false}
        />
        {/* Hover image crossfade */}
        {formattedHoverImg && formattedHoverImg !== formattedPrimaryImg && (
          <Image
            src={formattedHoverImg}
            alt={`${product?.name || 'Product'} alt`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
            priority={false}
          />
        )}
        {/* Accent glow on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 ring-accent/30 transition-all duration-300"></div>
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-4 bg-transparent">
        <h3 className="text-lg font-semibold text-secondary group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {product?.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">
            ₹{inr.format(priceNum)}
          </div>
          {product?.category && (
            <span className="text-xs px-3 py-1.5 bg-secondary/5 text-secondary/80 rounded-full font-medium border border-secondary/10 backdrop-blur-sm">
              {product.category}
            </span>
          )}
        </div>

        {/* Tags */}
        {product?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs">
            {product.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-primary/50 text-secondary/70 border border-secondary/10 backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
            {product.tags.length > 2 && <span className="text-secondary/60 font-medium">+{product.tags.length - 2}</span>}
          </div>
        )}
      </div>

      {/* Floating Actions (animate in) */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -12 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="absolute top-4 right-4 flex flex-col gap-3 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          className="p-3 rounded-full bg-primary/90 text-secondary border border-secondary/10 hover:text-accent hover:border-accent/20 shadow-lg backdrop-blur-sm transition-all duration-300"
          aria-label="Add to wishlist"
        >
          <FaHeart size={16} />
        </motion.button>
      </motion.div>

      {/* Bottom Action Bar (slide up) */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: hovered ? 0 : 60, opacity: hovered ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-primary/95 via-primary/80 to-transparent backdrop-blur-md border-t border-secondary/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          {/* Stock Status - Fixed visibility */}
          <span
            className={`text-xs px-3 py-1.5 rounded-full font-medium border backdrop-blur-sm ${
              product?.inStock
                ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/60'
                : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/60'
            }`}
          >
            {product?.inStock ? '✅ In Stock' : '❌ Out of Stock'}
          </span>

          {/* Add to Cart - Restored original colors */}
          {product?.inStock && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                addToCart({
                  _id: product._id,
                  name: product.name,
                  price: priceNum,
                  image: primaryImg,
                  quantity: 1,
                });
              }}
              className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-amber-500 hover:to-amber-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl border border-amber-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 transition-all duration-300 backdrop-blur-sm"
              aria-label="Add to cart"
            >
              <FaShoppingCart size={16} />
              Add to Cart
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
