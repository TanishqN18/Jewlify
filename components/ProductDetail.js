'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPinterest, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import useCartStore from '../components/store/cartStore';

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
      className="text-xl w-8 h-8 rounded-full bg-secondary text-primary transition-all duration-300"
    >
      −
    </button>
    <span className="text-lg text-primary">{quantity}</span>
    <button
      onClick={() => setQuantity(quantity + 1)}
      className="text-xl w-8 h-8 rounded-full bg-secondary text-primary transition-all duration-300"
    >
      +
    </button>
  </div>
);

export default function ProductDetailPage({ product, relatedProducts }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCartStore();

  // Images: use product.images if provided, otherwise fallback to single image
  const images = (Array.isArray(product?.images) && product.images.length > 0)
    ? product.images
    : [product?.image].filter(Boolean);

  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const [isZoom, setIsZoom] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  const goNext = () => setCurrent((i) => (i + 1) % images.length);
  const goPrev = () => setCurrent((i) => (i - 1 + images.length) % images.length);

  const onMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  return (
    <div className="bg-primary min-h-screen transition-all duration-300">
      {/* Product Detail Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <div className="bg-secondary rounded-lg p-4 transition-all duration-300">
            <div
              ref={containerRef}
              className="relative aspect-square w-full overflow-hidden rounded-lg group"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') goNext();
                if (e.key === 'ArrowLeft') goPrev();
              }}
              onMouseEnter={() => setIsZoom(true)}
              onMouseLeave={() => setIsZoom(false)}
              onMouseMove={onMouseMove}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={images[current]}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.98, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: -30 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={images[current]}
                      alt={product?.name || 'Product image'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain"
                      priority={current === 0}
                      quality={100}
                      unoptimized
                    />
                  </div>

                  {/* Subtle zoom on hover following cursor */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    }}
                    animate={{ scale: isZoom ? 1.06 : 1 }}
                    transition={{ duration: 0.25 }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Left/Right controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/30 text-white hover:bg-black/40"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/30 text-white hover:bg-black/40"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Dots indicator */}
            {images.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to image ${i + 1}`}
                    onClick={() => setCurrent(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === current ? 'w-6 bg-gold' : 'w-2.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Optional thumbnails (click to jump) */}
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setCurrent(i)}
                    className={`relative aspect-square rounded-lg overflow-hidden border ${
                      i === current ? 'border-gold' : 'border-white/10'
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      sizes="25vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      quality={90}
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2 transition-colors duration-300">
                {product.name}
              </h1>
              <p className="text-gold text-2xl font-semibold">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary mb-2 transition-colors duration-300">
                Description
              </h3>
              <p className="text-secondary leading-relaxed transition-colors duration-300">
                {product.description || "Experience the perfect blend of traditional craftsmanship and modern elegance with this exquisite piece from our premium collection."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary transition-colors duration-300">
                Quantity
              </h3>
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            </div>

            <div className="flex items-center space-x-4">
              <span className="bg-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
              {product.tag && (
                <span className="bg-secondary text-secondary px-3 py-1 rounded-full text-sm transition-all duration-300">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gold hover:bg-yellow-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Add to Cart - ₹{(product.price * quantity).toLocaleString()}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Buy Now
              </button>
            </div>

            {/* Share Options */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-primary mb-3 transition-colors duration-300">
                Share this product
              </h3>
              <div className="flex space-x-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this amazing product: ${product.name} - ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300"
                >
                  <FaWhatsapp size={20} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing product: ${product.name}`)}&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                >
                  <FaPinterest size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-primary mb-6 transition-colors duration-300">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                href={`/product/${relatedProduct._id}`}
                className="bg-secondary rounded-lg p-4 hover:shadow-lg transition-all duration-300 group"
              >
                <Image
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="text-primary font-semibold mb-2 truncate transition-colors duration-300">
                  {relatedProduct.name}
                </h3>
                <p className="text-gold font-bold">
                  ₹{relatedProduct.price.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
