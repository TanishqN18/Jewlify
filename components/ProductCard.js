'use client';

import { useState } from 'react';
import useCartStore from '../components/store/cartStore';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaShoppingCart } from 'react-icons/fa';
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
      className="relative group overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800
                 bg-gradient-to-br from-white via-yellow-50 to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900
                 shadow transition-all duration-300 hover:shadow-lg hover:scale-[1.015] cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Featured Badge */}
      {showBadge && (
        <div className="absolute top-3 left-3 z-10 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
          Featured
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-56 md:h-64 lg:h-72">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold truncate text-neutral-800 dark:text-white">
          {product.name}
        </h3>

        <div className="text-sm text-yellow-700 dark:text-yellow-400 font-semibold">
          ₹{product.price}
        </div>

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 text-xs">
            {product.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-yellow-100 dark:bg-neutral-800 border border-yellow-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-400 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add to Cart Button + Stock Badge */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 z-20 pointer-events-none">
        {product.inStock && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
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
            className="p-3 rounded-full shadow-md bg-yellow-600 text-white hover:bg-yellow-700 transition pointer-events-auto"
          >
            <FaShoppingCart size={18} />
          </motion.button>
        )}

        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium pointer-events-none ${
            product.inStock
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </motion.div>
  );
}
