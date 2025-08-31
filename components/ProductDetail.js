'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPinterest, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import useCartStore  from '../components/store/cartStore'; // ✅ hook integration

// Reusable Components
const Badge = ({ text }) => (
  <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow">
    {text}
  </span>
);

const Button = ({ children, onClick, className }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-6 py-2 rounded-2xl font-semibold text-white shadow transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 ${className}`}
  >
    {children}
  </motion.button>
);

const QuantitySelector = ({ quantity, setQuantity }) => (
  <div className="flex items-center gap-3">
    <button
      onClick={() => setQuantity(Math.max(1, quantity - 1))}
      className="text-xl w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"
    >
      −
    </button>
    <span className="text-lg">{quantity}</span>
    <button
      onClick={() => setQuantity(quantity + 1)}
      className="text-xl w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"
    >
      +
    </button>
  </div>
);

export default function ProductDetailPage({ product, relatedProducts }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCartStore();

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* PRODUCT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain rounded-xl"
          />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-3">
            <Badge text={product.tag || product.category} />
            <span className="text-sm text-green-500 font-medium">In Stock</span>
          </div>
          <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">₹{product.price}</p>
          <p className="text-gray-700 dark:text-gray-300">{product.description}</p>

          {/* Quantity + Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            <Button
              onClick={handleBuyNow}
              className="bg-gradient-to-r from-pink-500 to-orange-500"
            >
              Buy Now
            </Button>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <span className="font-medium">Share:</span>
            <a href={`https://pinterest.com/pin/create/button/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
              <FaPinterest className="text-pink-600 text-2xl hover:scale-110 transition" />
            </a>
            <a href={`https://wa.me/?text=Check this out: ${shareUrl}`} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="text-green-500 text-2xl hover:scale-110 transition" />
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-sky-500 text-2xl hover:scale-110 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="mt-16">
        <div className="flex gap-6 border-b border-gray-300 dark:border-gray-700">
          {['description', 'reviews', 'care'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 font-semibold capitalize transition border-b-2 ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6 min-h-[120px] text-gray-700 dark:text-gray-300">
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p>{product.description}</p>
              </motion.div>
            )}
            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p>No reviews yet. Be the first to review this product!</p>
              </motion.div>
            )}
            {activeTab === 'care' && (
              <motion.div
                key="care"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ul className="list-disc ml-5 space-y-2">
                  <li>Avoid contact with water, perfume, and harsh chemicals.</li>
                  <li>Store in a dry, cool place in the original packaging.</li>
                  <li>Clean gently with a soft dry cloth after use.</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-20">
        <h2 className="text-xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {relatedProducts?.map((p) => (
            <Link href={`/product/${p._id}`} key={p._id}>
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow hover:shadow-md transition-all">
                <div className="relative w-full h-40">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <h3 className="mt-2 text-sm font-semibold">{p.name}</h3>
                <p className="text-sm text-purple-500 font-medium">₹{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
