'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPinterest, FaWhatsapp, FaTwitter, FaPenFancy, FaRulerCombined, FaCommentDots,
  FaChevronLeft, FaChevronRight, FaExpand, FaTimes, FaSearchPlus, FaSearchMinus
} from 'react-icons/fa';
import useCartStore from './store/cartStore';

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
      className="text-xl w-8 h-8 rounded-full bg-secondary text-primary transition-all duration-300 hover:bg-gold"
    >
      −
    </button>
    <span className="text-lg text-primary font-semibold">{quantity}</span>
    <button
      onClick={() => setQuantity(quantity + 1)}
      className="text-xl w-8 h-8 rounded-full bg-secondary text-primary transition-all duration-300 hover:bg-gold"
    >
      +
    </button>
  </div>
);

export default function ProductDetailPage({ product, relatedProducts }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [customization, setCustomization] = useState({
    engraving: "",
    size: "",
    specialInstructions: "",
  });
  const { addToCart, fetchRates, goldRate, silverRate } = useCartStore();

  useEffect(() => {
    fetchRates(); // Fetch rates when the component mounts
  }, [fetchRates]);

  // Debug logs
  console.log('Full product prop:', product);
  console.log('Product structure:', JSON.stringify(product, null, 2));

  // Extract product data properly - handle both direct and nested data
  const productData = useMemo(() => {
    const data = product?.data || product;
    console.log('Extracted productData:', data);
    return data;
  }, [product]);

  // SSR-safe share URL
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';
  const canonicalPath = productData?.slug ? `/product/${productData.slug}` : `/product/${productData?._id}`;
  const shareUrl = `${SITE_URL}${canonicalPath}`;

  // Consistent currency formatting
  const formatter = useMemo(() => new Intl.NumberFormat('en-IN'), []);

  // IMAGES - Enhanced debugging and URL fixing
  const images = useMemo(() => {
    console.log('Processing images for productData:', productData);
    
    let imageArray = [];

    // Priority order: imageUrls, coverImage, image (for backward compatibility)
    if (productData?.imageUrls && Array.isArray(productData.imageUrls) && productData.imageUrls.length > 0) {
      imageArray = productData.imageUrls;
      console.log('Using imageUrls:', imageArray);
    } else if (productData?.coverImage) {
      imageArray = [productData.coverImage];
      console.log('Using coverImage:', imageArray);
    } else if (productData?.image) {
      if (Array.isArray(productData.image)) {
        imageArray = productData.image;
      } else if (typeof productData.image === 'string') {
        imageArray = [productData.image];
      }
      console.log('Using image field:', imageArray);
    }

    // Fix Cloudinary URLs and filter out empty strings
    const validImages = imageArray
      .filter(url => url && typeof url === 'string' && url.trim().length > 0)
      .map(url => {
        // Fix the Cloudinary URL typo if present
        return url;
      });

    console.log('Final valid images:', validImages);

    // Return valid images or fallback
    if (validImages.length === 0) {
      console.log('No valid images found, using fallback');
      return ['/fallback.png'];
    }

    return validImages;
  }, [productData]);

  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' });
  const [imageError, setImageError] = useState({});
  const imgWrapRef = useRef(null);
  const total = images.length;
  const isMultiple = total > 1;

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: `${x}%`, y: `${y}%` });
  };

  // Handle image load errors
  const handleImageError = useCallback((index, src) => {
    console.error(`Failed to load image at index ${index}:`, src);
    setImageError(prev => ({ ...prev, [index]: true }));
  }, []);

  // Customization accordion
  const [showCustomize, setShowCustomize] = useState(false);

  const next = useCallback(() => setCurrent((i) => (i + 1) % Math.max(images.length, 1)), [images.length]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1)), [images.length]);

  // Lightbox keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (lightbox) {
        if (e.key === 'Escape') setLightbox(false);
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, next, prev]);

  // Close zoom on outside click
  useEffect(() => {
    if (!zooming) return;
    const onDocClick = (e) => {
      if (imgWrapRef.current && !imgWrapRef.current.contains(e.target)) {
        setZooming(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [zooming]);

  // Customization defaults
  const customizationOptions = productData?.customizationOptions || {
    allowEngraving: false,
    maxEngravingLength: 20,
    allowSpecialInstructions: false,
    sizeOptions: []
  };

  const handleAddToCart = () => {
    addToCart(productData, customization, quantity);
    const toast = document.createElement("div");
    toast.className = "fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50";
    toast.innerHTML = `<div class="font-semibold">Added to cart!</div><div class="text-sm opacity-90">${productData?.name} ${quantity > 1 ? `(${quantity})` : ''}</div>`;
    document.body.appendChild(toast);
    setTimeout(() => document.body.contains(toast) && document.body.removeChild(toast), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  // Enhanced price calculation
  const getDisplayPrice = () => {
    // If priceType is fixed, always use the price field
    if (productData?.priceType === 'fixed' && productData?.price > 0) {
      return productData.price;
    }

    // If currentPrice is available, use it
    if (productData?.currentPrice && productData.currentPrice > 0) {
      return productData.currentPrice;
    }

    // Weight-based calculation
    if (productData?.weight && productData.weight > 0) {
      const material = productData.material?.toLowerCase() || '';
      if (material === 'gold' && goldRate > 0) return productData.weight * goldRate;
      if (material === 'silver' && silverRate > 0) return productData.weight * silverRate;
    }

    // Fallback
    return productData?.price || 0;
  };

  const displayPrice = getDisplayPrice();
  console.log('Final display price:', displayPrice);

  // Check if product is in stock
  const isInStock = productData?.inStock === true && (productData?.stock > 0);
  console.log('Stock check:', {
    inStock: productData?.inStock,
    stock: productData?.stock,
    isInStock
  });

  // Function to get the first image URL
  const getFirstImage = (images) => {
    if (images && images.length > 0) {
      return images[0]; // Return the first image URL
    }
    return null; // Return null if no images are available
  };

  return (
    <div className="bg-primary min-h-screen transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* IMAGE GALLERY */}
          <div className="bg-secondary rounded-2xl p-6 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            {/* Vertical thumbs + main image */}
            <div className="grid grid-cols-[76px,1fr] md:grid-cols-[88px,1fr] gap-4 items-start">
              {/* Left vertical thumbnails */}
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[70vh] pr-1">
                {images.length > 0 && images[0] !== '/fallback.png' ? (
                  images.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      onClick={(e) => { e.stopPropagation(); setCurrent(i); setZooming(false); }}
                      className={`relative rounded-lg overflow-hidden border transition-all w-[72px] h-[72px] md:w-[84px] md:h-[84px] ${
                        current === i ? 'border-gold ring-2 ring-gold/60' : 'border-white/10 hover:border-white/30'
                      }`}
                      aria-label={`Show image ${i + 1}`}
                    >
                      {!imageError[i] ? (
                        <Image
                          src={src}
                          alt={`${productData?.name} thumbnail ${i + 1}`}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(i, src)}
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          Error
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="text-xs text-secondary">No images</div>
                )}
              </div>

              {/* Main image panel */}
              <div className="flex flex-col">
                <div
                  className={`relative rounded-xl overflow-hidden border border-white/10 ${zooming ? 'cursor-zoom-out' : 'cursor-zoom-in'} px-4 md:px-6 py-4`}
                >
                  {images.length > 0 && images[0] !== '/fallback.png' ? (
                    <>
                      {/* Aspect-ratio container to lock height and avoid overflow */}
                      <div
                        ref={imgWrapRef}
                        className="group relative w-full aspect-[4/3] md:aspect-[4/3] lg:aspect-[4/3]"
                        onMouseMove={zooming ? onMove : undefined}
                        onClick={() => setZooming(z => !z)}
                      >
                        {!imageError[current] ? (
                          <Image
                            key={images[current]}
                            src={images[current]}
                            alt={`${productData?.name} - Image ${current + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain transition-transform duration-300 will-change-transform"
                            style={{
                              transformOrigin: `${origin.x} ${origin.y}`,
                              transform: zooming ? 'scale(1.6)' : 'scale(1)',
                            }}
                            priority
                            onError={() => handleImageError(current, images[current])}
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📷</div>
                              <div className="text-sm">Image not available</div>
                            </div>
                          </div>
                        )}

                        {/* Aligned gold arrows inside the aspect box */}
                        {isMultiple && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); prev(); }}
                              className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-gold text-white shadow-lg shadow-gold/30 hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-white/40"
                              aria-label="Previous image"
                            >
                              <FaChevronLeft />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); next(); }}
                              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-gold text-white shadow-lg shadow-gold/30 hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-white/40"
                              aria-label="Next image"
                            >
                              <FaChevronRight />
                            </button>
                          </>
                        )}

                        {/* Fullscreen (top-right, aligned) */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
                          className="absolute top-2 md:top-3 right-2 md:right-3 z-10 p-2 rounded-full bg-gold text-white shadow-md hover:bg-gold/90"
                          aria-label="Open fullscreen"
                        >
                          <FaExpand />
                        </button>

                        {/* Zoom hint */}
                        {!zooming && (
                          <div className="pointer-events-none absolute left-2 md:left-3 bottom-2 md:bottom-3 z-10 text-white/90 text-xs bg-black/40 rounded-full px-2 py-1 flex items-center gap-1">
                            <FaSearchPlus />
                            <span>Click to zoom</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-[360px] grid place-items-center text-secondary">
                      <div className="text-center">
                        <div className="text-6xl mb-4 text-secondary/50">📷</div>
                        <div className="text-lg">No image available</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Animated dots below image */}
                <div className="mt-4 flex items-center justify-center">
                  {images.length > 0 && images[0] !== '/fallback.png' && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/40 border border-white/10">
                      {images.map((_, i) => (
                        <motion.button
                          key={`dot-${i}`}
                          onClick={() => { setCurrent(i); setZooming(false); }}
                          className={`relative h-2.5 ${current === i ? 'w-6' : 'w-2.5'} rounded-full overflow-hidden`}
                          aria-label={`Go to image ${i + 1}`}
                          aria-current={current === i ? 'true' : 'false'}
                          layout
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        >
                          <span className={`${current === i ? 'bg-gold' : 'bg-white/60 hover:bg-white'} absolute inset-0`} />
                          {current === i && (
                            <motion.span layoutId="dot-glow" className="absolute inset-0 rounded-full shadow-[0_0_0_2px_rgba(212,175,55,0.45)]" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2 transition-colors duration-300">
                {productData?.name || 'Product Name'}
              </h1>
              <p className="text-gold text-2xl font-semibold">
                ₹{formatter.format(displayPrice)}
              </p>
              {productData?.weight && (
                <div className="text-sm pt-1 font-semibold mt-1">
                  <span className="text-gold">Weight:</span>{' '}
                  <span className="text-primary">{productData.weight}g</span>
                </div>
              )}

              {Array.isArray(productData.gemstones) && productData.gemstones.length > 0 && (
                <div className="mt-2">
                  <span className="text-pink-600 font-semibold">Gemstones:</span>{' '}
                  <span className="text-primary">{productData.gemstones.join(', ')}</span>
                </div>
              )}

              {productData.material && productData.material.toLowerCase().includes('mixed') && (
                <div className="mt-2">
                  <span className="text-purple-600 font-semibold">Material:</span>{' '}
                  <span className="text-primary">{productData.material}</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary mb-2 transition-colors duration-300">
                Description
              </h3>
              <p className="text-secondary leading-relaxed transition-colors duration-300">
                {productData?.description || "Experience the perfect blend of traditional craftsmanship and modern elegance with this exquisite piece from our premium collection."}
              </p>
            </div>

            {/* Customization options */}
            {(customizationOptions.allowEngraving ||
              customizationOptions.allowSpecialInstructions ||
              (Array.isArray(customizationOptions.sizeOptions) && customizationOptions.sizeOptions.length > 0)) && (
              <div className="border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCustomize(v => !v)}
                  className="w-full flex items-center justify-between bg-secondary/30 hover:bg-secondary/40 border border-white/10 rounded-xl px-4 py-3 text-left transition-all"
                  aria-expanded={showCustomize}
                >
                  <span className="text-primary font-bold text-lg">✨ Customize Your Product</span>
                  <span className="text-secondary text-sm">{showCustomize ? 'Hide' : 'Show'}</span>
                </button>

                <AnimatePresence initial={false}>
                  {showCustomize && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 pt-4">
                        {customizationOptions.allowEngraving && (
                          <div className="bg-secondary/20 border border-white/10 rounded-xl p-4">
                            <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-3">
                              <FaPenFancy className="text-gold" />
                              Engraving (max {customizationOptions.maxEngravingLength} characters)
                            </label>
                            <input
                              type="text"
                              value={customization.engraving}
                              onChange={(e) =>
                                setCustomization(prev => ({
                                  ...prev,
                                  engraving: e.target.value.slice(0, customizationOptions.maxEngravingLength),
                                }))
                              }
                              placeholder="Enter text to engrave..."
                              className="w-full bg-primary/50 border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold transition-all text-sm"
                            />
                            <div className="text-xs text-secondary mt-2 text-right">
                              {customization.engraving.length}/{customizationOptions.maxEngravingLength} characters
                            </div>
                          </div>
                        )}

                        {Array.isArray(customizationOptions.sizeOptions) &&
                          customizationOptions.sizeOptions.length > 0 && (
                            <div className="bg-secondary/20 border border-white/10 rounded-xl p-4">
                              <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-3">
                                <FaRulerCombined className="text-gold" />
                                Size Selection
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {customizationOptions.sizeOptions.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setCustomization(prev => ({ ...prev, size }))
                                    }
                                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                                      customization.size === size
                                        ? 'border-gold bg-gold/20 text-primary'
                                        : 'border-white/20 text-secondary hover:text-primary hover:border-gold/50 hover:bg-gold/10'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                              {customization.size && (
                                <div className="text-xs text-gold mt-2">Selected: {customization.size}</div>
                              )}
                            </div>
                          )}

                        {customizationOptions.allowSpecialInstructions && (
                          <div className="bg-secondary/20 border border-white/10 rounded-xl p-4">
                            <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-3">
                              <FaCommentDots className="text-gold" />
                              Special Instructions
                            </label>
                            <textarea
                              value={customization.specialInstructions}
                              onChange={(e) =>
                                setCustomization(prev => ({ ...prev, specialInstructions: e.target.value }))
                              }
                              placeholder="Any special requests or instructions..."
                              rows={3}
                              className="w-full bg-primary/50 border border-white/20 rounded-xl px-4 py-3 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold transition-all text-sm resize-none"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary transition-colors duration-300">
                Quantity
              </h3>
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            </div>

            {/* Tags */}
            <div className="flex items-center space-x-4 flex-wrap gap-2">
              {productData?.category && (
                <span className="bg-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                  {productData.category}
                </span>
              )}
              {productData?.material && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300
                    ${(() => {
                      const mat = productData.material?.toLowerCase() || '';
                      if (mat.includes('gold')) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 border border-yellow-300 shadow-gold';
                      if (mat.includes('silver')) return 'bg-gradient-to-r from-gray-200 to-gray-400 text-gray-800 border border-gray-300 shadow';
                      if (mat.includes('diamond')) return 'bg-gradient-to-r from-blue-100 to-white text-blue-700 border border-blue-200 shadow';
                      if (mat.includes('platinum')) return 'bg-gradient-to-r from-slate-300 to-slate-500 text-slate-900 border border-slate-400 shadow';
                      if (mat.includes('mixed')) return 'bg-gradient-to-r from-pink-300 via-yellow-200 to-blue-200 text-purple-900 border border-purple-200 shadow';
                      if (mat.includes('gemstone')) return 'bg-gradient-to-r from-emerald-200 to-emerald-400 text-emerald-900 border border-emerald-300 shadow';
                      return 'bg-secondary/60 text-primary border border-white/20';
                    })()}
                `}
              >
                {productData.material}
              </span>
              )}
              {productData?.tags && productData.tags.length > 0 && productData.tags.map((tag, index) => (
                <span key={index} className="bg-secondary/40 text-primary px-3 py-1 rounded-full text-sm transition-all duration-300">
                  {tag}
                </span>
              ))}
              {productData?.status && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {productData.status}
                </span>
              )}
            </div>

            {/* Stock Status - Fixed */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isInStock
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isInStock ? `In Stock (available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="w-full bg-gold hover:opacity-90 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInStock
                  ? `Add to Cart - ₹${formatter.format(displayPrice * quantity)}`
                  : 'Out of Stock'
                }
              </button>

              {isInStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-secondary border border-gold text-primary hover:bg-gold hover:text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Buy Now
                </button>
              )}
            </div>

            {/* Share (SSR-safe) */}
            <div className="border-t border-white/10 pt-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-primary mb-3 transition-colors duration-300">
                Share this product
              </h3>
              <div className="flex space-x-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this amazing product: ${productData?.name} - ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-300"
                >
                  <FaWhatsapp size={20} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing product: ${productData?.name}`)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-300"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(productData?.name || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300"
                >
                  <FaPinterest size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && images.length > 0 && images[0] !== '/fallback.png' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightbox(false); }}
              className="absolute top-4 right-4 z-[61] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div
              className="absolute inset-0 flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={images[current]}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative max-w-5xl w-full"
              >
                <Image
                  src={images[current]}
                  alt={`${productData?.name} - fullscreen ${current + 1}`}
                  width={1600}
                  height={1600}
                  className="w-full h-auto rounded-xl shadow-2xl object-contain"
                  unoptimized
                />

                <div className="absolute inset-y-0 left-0 flex items-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="m-2 p-3 rounded-full bg-gold text-white shadow-lg shadow-gold/30 hover:bg-gold/90"
                    aria-label="Previous"
                  >
                    <FaChevronLeft />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="m-2 p-3 rounded-full bg-gold text-white shadow-lg shadow-gold/30 hover:bg-gold/90"
                    aria-label="Next"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </motion.div>
            </div>

            {images.length > 1 && (
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 bg-white/5 rounded-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((src, i) => (
                  <button
                    key={'lb-'+src+i}
                    onClick={() => setCurrent(i)}
                    className={`rounded overflow-hidden border ${current===i?'border-gold':'border-white/20'}`}
                  >
                    <Image 
                      src={src} 
                      alt={`thumb ${i+1}`} 
                      width={56} 
                      height={56} 
                      className="w-14 h-14 object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-primary mb-6 transition-colors duration-300">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => {
              const relatedData = relatedProduct?.data || relatedProduct;
              // Fix: getFirstImage should take the whole product, not just imageUrls
              const getFirstImage = (product) => {
                if (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
                  return product.imageUrls[0];
                }
                if (product.coverImage) {
                  return product.coverImage;
                }
                if (product.image) {
                  return Array.isArray(product.image) ? product.image[0] : product.image;
                }
                return '/fallback.png';
              };

              const firstImage = getFirstImage(relatedData);

              return (
                <Link
                  key={relatedData._id}
                  href={`/product/${relatedData._id}`}
                  className="bg-secondary rounded-lg p-4 hover:shadow-lg transition-all duration-300 group"
                >
                  {firstImage && firstImage !== '/fallback.png' ? (
                    <Image
                      src={firstImage}
                      alt={relatedData.name}
                      width={200}
                      height={200}
                    />
                  ) : (
                    <div>No image available</div>
                  )}
                  <h3 className="text-primary font-semibold mb-2 truncate transition-colors duration-300">
                    {relatedData.name}
                  </h3>
                  <p className="text-gold font-bold">
                    ₹{formatter.format(relatedData.currentPrice || relatedData.fixedPrice || relatedData.price || 0)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
