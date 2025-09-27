'use client';

import { useState } from 'react';
import useCartStore from '../components/store/cartStore';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product, showBadge = false }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const handleCardClick = () => {
    router.push(`/product/${product._id}`);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700
                 bg-primary shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Featured Badge */}
      {showBadge && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          ✨ Featured
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-56 md:h-64 lg:h-72 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        
        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3 bg-primary">
        <h3 className="text-base font-semibold truncate text-primary group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
            ₹{product.price.toLocaleString()}
          </div>
          
          {/* Category Badge */}
          {product.category && (
            <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-full font-medium">
              {product.category}
            </span>
          )}
        </div>

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 text-xs">
            {product.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="bg-secondary border border-gray-200 dark:border-gray-700 text-secondary px-2 py-0.5 rounded-full transition-colors duration-300"
              >
                #{tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span className="text-secondary">+{product.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        {/* Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          onClick={(e) => {
            e.stopPropagation();
            // Add wishlist functionality here
          }}
          className="p-2 rounded-full bg-primary text-secondary backdrop-blur-sm hover:text-red-500 transition-all shadow-md"
        >
          <FaHeart size={14} />
        </motion.button>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary via-primary/70 to-transparent backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center justify-between">
          {/* Stock Status */}
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              product.inStock
                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
            }`}
          >
            {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
          </span>

          {/* Add to Cart Button */}
          {product.inStock && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={(e) => {
                e.stopPropagation();
                addToCart({
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  quantity: 1,
                });
              }}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-sm font-medium rounded-lg shadow-md transition-all"
            >
              <FaShoppingCart size={14} />
              Add to Cart
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
