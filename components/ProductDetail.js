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

const getMaterialBadgeClasses = (materialRaw = '') => {
  const mat = materialRaw.toLowerCase();

  if (mat.includes('gold'))
    return 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-yellow-900 border border-yellow-300 shadow';

  if (mat.includes('silver'))
    return 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 text-gray-800 border border-gray-300 shadow';

  if (mat.includes('diamond'))
    return 'bg-gradient-to-r from-sky-100 via-white to-sky-200 text-sky-800 border border-sky-200 shadow';

  if (mat.includes('platinum'))
    return 'bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500 text-slate-900 border border-slate-400 shadow';

  if (mat.includes('mixed'))
    return 'bg-gradient-to-r from-pink-300 via-amber-200 to-indigo-200 text-purple-900 border border-purple-200 shadow';

  if (mat.includes('gemstone'))
    return 'bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-400 text-emerald-900 border border-emerald-300 shadow';

  // ✅ NEW explicit styling for "other" and any unknown material
  if (mat.includes('other') || mat === '' )
    return 'bg-gradient-to-r from-stone-200 via-stone-300 to-stone-400 text-stone-800 border border-stone-300 shadow';

  // Fallback (treat as “Other”)
  return 'bg-gradient-to-r from-stone-200 via-stone-300 to-stone-400 text-stone-800 border border-stone-300 shadow';
};

const getTagClasses = (i) => {
  // Branded, subtle palettes (rotated by index)
  const palettes = [
    // Soft gold haze
    'bg-gradient-to-br from-gold/30 via-gold/15 to-transparent border border-gold/35 text-primary shadow-[0_1px_2px_rgba(0,0,0,0.15)]',
    // Muted secondary pill
    'bg-secondary/50 border border-white/10 text-primary shadow-[0_1px_2px_rgba(0,0,0,0.15)]',
    // Primary subtle glow
    'bg-primary/50 border border-white/10 text-primary shadow-[0_1px_2px_rgba(0,0,0,0.15)]',
    // Gold outlined minimal
    'bg-primary/40 border border-gold/30 text-primary shadow-[0_1px_2px_rgba(0,0,0,0.15)]',
    // Slight emerald accent (optional neutral accent)
    'bg-gradient-to-br from-emerald-400/15 via-emerald-300/10 to-transparent border border-emerald-400/25 text-primary shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
  ];
  return `${palettes[i % palettes.length]} rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide
          backdrop-blur-sm hover:border-gold/60 hover:bg-gold/15 transition-colors`;
};

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

  // 1) Inside ProductDetailPage component, ADD these new helpers & state near other hooks (just after existing useState declarations):

  const [activeInfoTab, setActiveInfoTab] = useState('price'); // 'details' | 'price'
  const [openAccordions, setOpenAccordions] = useState({ metal:true, diamond:false, general:false, desc:false });

  const toggleAcc = (key) =>
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));

  // Price breakup computation
  const priceBreakup = useMemo(() => {
    if (!productData) return null;

    const karat = productData.purityKarat || 22; // optional new field
    const weight = productData.weight || 0;
    const isWeight = productData.priceType === 'weight-based';

    // Metal value
    let metalRatePerGram = 0;
    if (productData.material?.toLowerCase() === 'gold') metalRatePerGram = goldRate || 0;
    if (productData.material?.toLowerCase() === 'silver') metalRatePerGram = silverRate || 0;

    const metalValue = isWeight ? +(weight * metalRatePerGram).toFixed(2) : 0;

    // Stone (simplified — you can extend)
    const stoneWeightCt = productData.stoneWeightCt || 0; // optional field
    const stoneRatePerCt = productData.stoneRatePerCt || 0;
    const stoneValue = +(stoneWeightCt * stoneRatePerCt).toFixed(2);

    // Fixed price fallback
    const baseFixed = productData.priceType === 'fixed'
      ? (productData.fixedPrice || productData.price || 0)
      : 0;

    // Making charges
    const makingChargesPercent = productData.makingChargesPercent ?? 12; // default 12%
    const makingChargesFlat = productData.makingChargesFlat ?? 0;
    const makingCharges = makingChargesFlat || +(((metalValue || baseFixed) * makingChargesPercent) / 100).toFixed(2);

    // Subtotal before discount (if fixed, show fixed; else sum)
    const subTotal = productData.priceType === 'fixed'
      ? baseFixed
      : +(metalValue + stoneValue + makingCharges).toFixed(2);

    // Discount
    const discountPercent = productData.discountPercent ?? 0;
    const discountValue = +((subTotal * discountPercent) / 100).toFixed(2);

    const afterDiscount = +(subTotal - discountValue).toFixed(2);

    // GST
    const gstPercent = productData.gstPercent ?? 3; // typical hallmark jewellery GST slab (example)
    const gstValue = +((afterDiscount * gstPercent) / 100).toFixed(2);

    const grandTotal = +(afterDiscount + gstValue).toFixed(2);

    return {
      karat,
      weight,
      metalRatePerGram,
      metalValue,
      stoneWeightCt,
      stoneRatePerCt,
      stoneValue,
      makingChargesPercent,
      makingCharges,
      discountPercent,
      discountValue,
      gstPercent,
      gstValue,
      subTotal,
      afterDiscount,
      grandTotal,
      baseFixed,
      priceType: productData.priceType
    };
  }, [productData, goldRate, silverRate]);

  const [deliveryDetails, setDeliveryDetails] = useState({
    country: 'India',
    pincode: '',
    isChecking: false,
    deliveryInfo: null,
    error: null
  });

  const checkDelivery = async () => {
    if (!deliveryDetails.pincode || deliveryDetails.pincode.length !== 6) {
      setDeliveryDetails(prev => ({ 
        ...prev, 
        error: 'Please enter a valid 6-digit pincode' 
      }));
      return;
    }

    setDeliveryDetails(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      // Simulate API call - replace with your actual delivery API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock delivery data - replace with actual API response
      const mockDeliveryInfo = {
        available: true,
        estimatedDays: Math.floor(Math.random() * 5) + 3, // 3-7 days
        charges: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 100) + 50,
        codAvailable: Math.random() > 0.3,
        expressAvailable: Math.random() > 0.6
      };

      setDeliveryDetails(prev => ({ 
        ...prev, 
        isChecking: false, 
        deliveryInfo: mockDeliveryInfo 
      }));
    } catch (error) {
      setDeliveryDetails(prev => ({ 
        ...prev, 
        isChecking: false, 
        error: 'Unable to check delivery. Please try again.' 
      }));
    }
  };

  return (
    <div className="bg-primary min-h-screen transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* IMAGE GALLERY */}
          <div className="bg-secondary rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <div className="flex flex-col gap-5">
              
              {/* Main image frame (fixed height / aspect to prevent shifting) */}
              <div
                className={`relative rounded-xl border border-white/10 overflow-hidden group
                            ${zooming ? 'cursor-zoom-out' : 'cursor-zoom-in'}
                            bg-primary/60 backdrop-blur-sm`}
              >
                <div
                  ref={imgWrapRef}
                  className="relative w-full h-[360px] md:h-[480px] select-none"
                  onMouseMove={zooming ? onMove : undefined}
                  onClick={() => setZooming(z => !z)}
                >
                  {images.length > 0 && images[0] !== '/fallback.png' && !imageError[current] ? (
                    <Image
                      key={images[current]}
                      src={images[current]}
                      alt={`${productData?.name} - Image ${current + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain transition-transform duration-300 will-change-transform"
                      style={{
                        transformOrigin: `${origin.x} ${origin.y}`,
                        transform: zooming ? 'scale(1.7)' : 'scale(1)',
                      }}
                      priority
                      onError={() => handleImageError(current, images[current])}
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-secondary">
                      <div className="text-center">
                        <div className="text-5xl mb-3 opacity-40">📷</div>
                        <div className="text-sm opacity-70">Image not available</div>
                      </div>
                    </div>
                  )}

                  {/* Nav arrows (no layout shift) */}
                  {isMultiple && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-gold text-white shadow-lg hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-white/40"
                        aria-label="Previous image"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-gold text-white shadow-lg hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-white/40"
                        aria-label="Next image"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
                      className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-gold text-white shadow hover:bg-gold/90"
                    aria-label="Open fullscreen"
                  >
                    <FaExpand />
                  </button>

                  {!zooming && (
                    <div className="pointer-events-none absolute left-4 bottom-4 z-10 text-white/95 text-xs bg-black/45 rounded-full px-2.5 py-1 flex items-center gap-1.5">
                      <FaSearchPlus className="text-[10px]" />
                      <span>Click to zoom</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails row (equal sizes, centered) */}
              <div className="flex flex-wrap justify-center gap-4">
                {images.length > 0 && images[0] !== '/fallback.png' ? (
                  images.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      onClick={(e) => { e.stopPropagation(); setCurrent(i); setZooming(false); }}
                      className={`relative rounded-lg overflow-hidden border w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-primary/40
                        transition-all duration-200 
                        ${current === i
                          ? 'border-gold ring-2 ring-gold/50 shadow-md'
                          : 'border-white/10 hover:border-gold/50 hover:shadow'
                        }`}
                      aria-label={`Show image ${i + 1}`}
                    >
                      {!imageError[i] ? (
                        <Image
                          src={src}
                          alt={`${productData?.name} thumbnail ${i + 1}`}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(i, src)}
                          unoptimized
                        />
                      ) : (
                        <div className="text-[10px] text-secondary">Err</div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="text-xs text-secondary px-2">No images</div>
                )}
              </div>

              {/* Position-stable dots */}
              {images.length > 1 && images[0] !== '/fallback.png' && (
                <div className="flex items-center justify-center pt-1">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/50 border border-white/10">
                    {images.map((_, i) => (
                      <motion.button
                        key={`dot-${i}`}
                        onClick={() => { setCurrent(i); setZooming(false); }}
                        className={`relative h-2.5 ${current === i ? 'w-7' : 'w-2.5'} rounded-full overflow-hidden transition-all`}
                        aria-label={`Go to image ${i + 1}`}
                        aria-current={current === i ? 'true' : 'false'}
                        layout
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      >
                        <span className={`${current === i ? 'bg-gold' : 'bg-white/50 hover:bg-white'} absolute inset-0`} />
                        {current === i && (
                          <motion.span layoutId="dot-glow" className="absolute inset-0 rounded-full shadow-[0_0_0_2px_rgba(212,175,55,0.45)]" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
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

            {/* Meta (category + material + status only) */}
            <div className="flex items-center flex-wrap gap-2">
              {productData?.category && (
                <span className="bg-gold text-white px-3 py-1 rounded-full text-sm font-medium shadow">
                  {productData.category}
                </span>
              )}
              {productData?.material && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMaterialBadgeClasses(productData.material)}`}>
                  {productData.material === 'Other' ? 'Artisan Metal' : productData.material}
                </span>
              )}
              {productData?.status && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {productData.status}
                </span>
              )}
            </div>

            {/* Style Tags */}
            {productData?.tags?.length > 0 && (
              <div className="pt-2">
                <h4 className="text-sm font-semibold text-primary mb-2 tracking-wide uppercase">Style Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {productData.tags.map((tag, i) => (
                    <span
                      key={tag + i}
                      className={getTagClasses(i)}
                    >
                      {tag.replace(/\s+/g, '').toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

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

      {/* Delivery Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="bg-secondary/60 rounded-2xl border border-white/10 shadow-lg backdrop-blur-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-sm">🚚</span>
              </div>
              <h3 className="text-primary font-bold text-xl">Delivery Details</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Pincode Checker */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Country Selector */}
                  <div className="relative">
                    <select
                      value={deliveryDetails.country}
                      onChange={(e) => setDeliveryDetails(prev => ({ 
                        ...prev, 
                        country: e.target.value,
                        deliveryInfo: null 
                      }))}
                      className="w-full bg-primary/60 border border-white/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold transition-all appearance-none cursor-pointer"
                    >
                      <option value="India">🇮🇳 India</option>
                      <option value="USA">🇺🇸 USA</option>
                      <option value="UK">🇬🇧 UK</option>
                      <option value="Canada">🇨🇦 Canada</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Pincode Input */}
                  <div className="sm:col-span-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={deliveryDetails.pincode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setDeliveryDetails(prev => ({ 
                            ...prev, 
                            pincode: value,
                            error: null,
                            deliveryInfo: null 
                          }));
                        }}
                        placeholder="Enter Pincode"
                        className="w-full bg-primary/60 border border-white/20 rounded-xl px-4 py-3 pr-24 text-primary placeholder:text-secondary/60 focus:outline-none focus:border-gold transition-all"
                        maxLength="6"
                      />
                      <button
                        onClick={checkDelivery}
                        disabled={deliveryDetails.isChecking || deliveryDetails.pincode.length !== 6}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
                      >
                        {deliveryDetails.isChecking ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">Checking...</span>
                          </div>
                        ) : (
                          'CHECK'
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {deliveryDetails.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm flex items-center gap-2"
                  >
                    <span>⚠️</span>
                    {deliveryDetails.error}
                  </motion.div>
                )}

                {/* Delivery Information */}
                <AnimatePresence>
                  {deliveryDetails.deliveryInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3"
                    >
                      {deliveryDetails.deliveryInfo.available ? (
                        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-emerald-400 text-lg">✅</span>
                            <span className="text-emerald-400 font-semibold">Delivery Available</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-secondary">Estimated Delivery:</span>
                              <span className="text-primary font-semibold">
                                {deliveryDetails.deliveryInfo.estimatedDays} days
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-secondary">Shipping Charges:</span>
                              <span className="text-primary font-semibold">
                                {deliveryDetails.deliveryInfo.charges === 0 
                                  ? 'FREE' 
                                  : `₹${deliveryDetails.deliveryInfo.charges}`
                                }
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-secondary">Cash on Delivery:</span>
                              <span className={`font-semibold ${deliveryDetails.deliveryInfo.codAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                                {deliveryDetails.deliveryInfo.codAvailable ? 'Available' : 'Not Available'}
                              </span>
                            </div>

                            {deliveryDetails.deliveryInfo.expressAvailable && (
                              <div className="flex justify-between">
                                <span className="text-secondary">Express Delivery:</span>
                                <span className="text-gold font-semibold">Available</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                          <div className="flex items-center gap-2">
                            <span className="text-red-400 text-lg">❌</span>
                            <span className="text-red-400 font-semibold">Delivery Not Available</span>
                          </div>
                          <p className="text-secondary text-sm mt-2">
                            Sorry, we do not deliver to this pincode yet. Please try a different pincode.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Delivery Information */}
              <div className="space-y-4">
                <h4 className="text-primary font-semibold text-lg flex items-center gap-2">
                  <span>📦</span>
                  Delivery Information
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/20 border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 text-sm">🚛</span>
                    </div>
                    <div>
                      <div className="text-primary font-medium text-sm">Standard Delivery</div>
                      <div className="text-secondary text-xs">3-7 business days</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/20 border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-gold text-sm">⚡</span>
                    </div>
                    <div>
                      <div className="text-primary font-medium text-sm">Express Delivery</div>
                      <div className="text-secondary text-xs">1-2 business days (Select cities)</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/20 border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-emerald-400 text-sm">💰</span>
                    </div>
                    <div>
                      <div className="text-primary font-medium text-sm">Cash on Delivery</div>
                      <div className="text-secondary text-xs">Pay when you receive</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/20 border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-400 text-sm">🔄</span>
                    </div>
                    <div>
                      <div className="text-primary font-medium text-sm">Easy Returns</div>
                      <div className="text-secondary text-xs">7-day return policy</div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-300/20">
                  <p className="text-xs text-secondary leading-relaxed">
                    💡 <strong>Free shipping</strong> on orders above ₹2,999. 
                    Express delivery available for metro cities. 
                    All jewelry is insured during transit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Details / Price Breakup Tabs with proper styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-center mb-10">
          <div className="relative flex bg-secondary/60 backdrop-blur-sm rounded-full p-1.5 border border-white/20 shadow-lg">
            {['details','price'].map(t => (
              <button
                key={t}
                onClick={() => setActiveInfoTab(t)}
                className={`relative z-10 px-8 py-3 text-sm font-semibold rounded-full transition-all duration-300
                  ${activeInfoTab===t 
                    ? 'text-white bg-gold shadow-lg' 
                    : 'text-secondary hover:text-primary hover:bg-white/10'
                  }`}
              >
                {t === 'details' ? 'Product Details' : 'Price Breakup'}
              </button>
            ))}
          </div>
        </div>

        {/* Price Breakup Tab */}
        {activeInfoTab === 'price' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Price Table */}
            <div className="bg-secondary/60 rounded-2xl overflow-hidden border border-white/10 shadow">
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <h3 className="text-primary font-semibold tracking-wide text-sm uppercase">
                  💰 Price Composition
                </h3>
                <span className="text-xs px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/30">
                  {priceBreakup?.priceType === 'fixed' ? 'Fixed Pricing' : 'Weight Based'}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-secondary/70 uppercase tracking-wide text-xs border-b border-white/10">
                      <th className="py-3 px-5">Product Details</th>
                      <th className="py-3 px-5">Rate</th>
                      <th className="py-3 px-5">Weight</th>
                      <th className="py-3 px-5">Discount</th>
                      <th className="py-3 px-5">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {/* Metal Row */}
                    {priceBreakup && (
                      <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="py-4 px-5 font-semibold flex items-center gap-3">
                          <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow" />
                          {productData.material || 'Metal'}
                          {priceBreakup.priceType === 'weight-based' && (
                            <span className="ml-2 text-xs text-secondary/70">{priceBreakup.karat}KT</span>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          {priceBreakup.priceType === 'weight-based'
                            ? `₹ ${priceBreakup.metalRatePerGram || 0}/g`
                            : '—'}
                        </td>
                        <td className="py-4 px-5">
                          {priceBreakup.priceType === 'weight-based'
                            ? `${priceBreakup.weight || 0}g`
                            : '—'}
                        </td>
                        <td className="py-4 px-5">—</td>
                        <td className="py-4 px-5 font-medium">
                          {priceBreakup.priceType === 'weight-based'
                            ? `₹ ${formatter.format(priceBreakup.metalValue)}`
                            : `₹ ${formatter.format(priceBreakup.baseFixed)}`}
                        </td>
                      </tr>
                    )}
                    
                    {/* Stone Row (only if value) */}
                    {priceBreakup && priceBreakup.stoneValue > 0 && (
                      <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="py-4 px-5 font-semibold flex items-center gap-3">
                          <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow" />
                          Stone
                        </td>
                        <td className="py-4 px-5">₹ {priceBreakup.stoneRatePerCt}/ct</td>
                        <td className="py-4 px-5">{priceBreakup.stoneWeightCt} ct</td>
                        <td className="py-4 px-5">—</td>
                        <td className="py-4 px-5 font-medium">₹ {formatter.format(priceBreakup.stoneValue)}</td>
                      </tr>
                    )}
                    
                    {/* Making Charges */}
                    {priceBreakup && (
                      <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="py-4 px-5 font-semibold">Making Charges</td>
                        <td className="py-4 px-5">
                          {productData.makingChargesFlat
                            ? 'Flat'
                            : `${priceBreakup.makingChargesPercent}%`}
                        </td>
                        <td className="py-4 px-5">—</td>
                        <td className="py-4 px-5">—</td>
                        <td className="py-4 px-5 font-medium">₹ {formatter.format(priceBreakup.makingCharges)}</td>
                      </tr>
                    )}
                    
                    {/* Subtotal */}
                    {priceBreakup && (
                      <tr className="bg-primary/30">
                        <td className="py-4 px-5 font-semibold">Sub Total</td>
                        <td className="py-4 px-5">—</td>
                        <td className="py-4 px-5">
                          {priceBreakup.priceType === 'weight-based'
                            ? `${priceBreakup.weight}g`
                            : '—'}
                        </td>
                        <td className="py-4 px-5">—</td>
                        <td className="py-4 px-5 font-semibold">₹ {formatter.format(priceBreakup.subTotal)}</td>
                      </tr>
                    )}
                    
                    {/* Discount */}
                    {priceBreakup && priceBreakup.discountPercent > 0 && (
                      <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="py-4 px-5 font-semibold">Discount</td>
                        <td className="py-4 px-5">{priceBreakup.discountPercent}%</td>
                        <td className="py-4 px-5">—</td>
                        <td className="py-4 px-5 text-emerald-500 font-medium">
                          -₹ {formatter.format(priceBreakup.discountValue)}
                        </td>
                        <td className="py-4 px-5">₹ {formatter.format(priceBreakup.afterDiscount)}</td>
                      </tr>
                    )}
                    
                    {/* GST */}
                    {priceBreakup && (
                      <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="py-4 px-5 font-semibold">GST</td>
                        <td className="py-4 px-5">{priceBreakup.gstPercent}%</td>
                        <td className="py-4 px-5">—</td>
                        <td className="py-4 px-5">—</td>
                        <td className="py-4 px-5 font-medium">₹ {formatter.format(priceBreakup.gstValue)}</td>
                      </tr>
                    )}
                    
                    {/* Grand Total */}
                    {priceBreakup && (
                      <tr className="bg-gold/12">
                        <td className="py-5 px-5 font-bold text-lg">Grand Total</td>
                        <td className="py-5 px-5" />
                        <td className="py-5 px-5" />
                        <td className="py-5 px-5" />
                        <td className="py-5 px-5 font-bold text-lg">₹ {formatter.format(priceBreakup.grandTotal)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Preview with SKU - Matching Product Details styling */}
            <div className="bg-secondary/60 rounded-2xl border border-white/10 p-5 flex flex-col">
              {/* SKU ID */}
              <div className="mb-4 text-center">
                <span className="text-xs text-secondary/70 uppercase tracking-wider">SKU ID</span>
                <div className="text-sm font-bold text-primary font-mono mt-1 px-3 py-2 bg-primary/20 rounded-lg border border-white/10">
                  {productData?.sku || productData?._id || 'Not available'}
                </div>
              </div>

              {/* Product Image - Same styling as Price Breakup */}
              <div className="flex items-center justify-center flex-1">
                {images[0] && images[0] !== '/fallback.png' ? (
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={images[0]}
                      alt={productData?.name || 'Product'}
                      fill
                      className="object-cover rounded-xl"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="text-secondary">No image</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Product Details Tab */}
        {activeInfoTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Accordions */}
            <div className="space-y-4">
              {/* Metal Details */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-secondary/50">
                <button
                  onClick={() => toggleAcc('metal')}
                  className="w-full flex justify-between items-center px-5 py-4 text-left"
                >
                  <span className="font-semibold text-primary tracking-wide">⚱️ METAL DETAILS</span>
                  <span className="text-secondary text-sm">{openAccordions.metal ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {openAccordions.metal && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        {/* Purity */}
                        <div>
                          <div className="text-lg font-bold text-primary">
                            {productData.purityKarat ? `${productData.purityKarat}K` : 
                             productData.material === 'Gold' ? '22K' :
                             productData.material === 'Silver' ? 'Sterling' :
                             'N/A'}
                          </div>
                          <div className="text-secondary/70 text-xs">Purity</div>
                        </div>
                        
                        {/* Material Color */}
                        <div>
                          <div className="text-lg font-bold text-primary capitalize">
                            {productData.materialColor ||
                             (productData.material === 'Gold' ? 'Yellow Gold' : 
                              productData.material === 'Silver' ? 'Silver' :
                              productData.material === 'Platinum' ? 'White Platinum' :
                              productData.material || 'Not specified')}
                          </div>
                          <div className="text-secondary/70 text-xs">Material Colour</div>
                        </div>
                        
                        {/* Gross Weight */}
                        <div>
                          <div className="text-lg font-bold text-primary">
                            {productData.weight ? `${productData.weight}g` : 'Not specified'}
                          </div>
                          <div className="text-secondary/70 text-xs">Gross Weight</div>
                        </div>
                        
                        {/* Metal Type */}
                        <div>
                          <div className="text-lg font-bold text-primary">
                            {productData.material || 'Not specified'}
                          </div>
                          <div className="text-secondary/70 text-xs">Metal Type</div>
                        </div>
                        
                        {/* Dimensions */}
                        {productData.dimensions && (productData.dimensions.length || productData.dimensions.width || productData.dimensions.height) && (
                          <div>
                            <div className="text-lg font-bold text-primary">
                              {productData.dimensions.length ? `${productData.dimensions.length} MM` :
                               productData.dimensions.width ? `${productData.dimensions.width} MM` :
                               productData.dimensions.height ? `${productData.dimensions.height} MM` :
                               'Custom'}
                            </div>
                            <div className="text-secondary/70 text-xs">Dimensions</div>
                          </div>
                        )}
                        
                        {/* Mixed Metals (if applicable) */}
                        {productData.material === 'Mixed' && productData.mixedMetals?.length > 0 && (
                          <div className="md:col-span-3">
                            <div className="text-lg font-bold text-primary">
                              {productData.mixedMetals.join(', ')}
                            </div>
                            <div className="text-secondary/70 text-xs">Mixed Metal Types</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Stone Details */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-secondary/50">
                <button
                  onClick={() => toggleAcc('diamond')}
                  className="w-full flex justify-between items-center px-5 py-4 text-left"
                >
                  <span className="font-semibold text-primary tracking-wide">💎 STONE DETAILS</span>
                  <span className="text-secondary text-sm">{openAccordions.diamond ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {openAccordions.diamond && (
                    <motion.div
                      initial={{ height:0, opacity:0 }}
                      animate={{ height:'auto', opacity:1 }}
                      exit={{ height:0, opacity:0 }}
                      className="px-5 pb-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        {/* Gemstones */}
                        {Array.isArray(productData.gemstones) && productData.gemstones.length > 0 ? (
                          <div className="md:col-span-2">
                            <div className="text-lg font-bold text-primary">
                              {productData.gemstones.join(', ')}
                            </div>
                            <div className="text-secondary/70 text-xs">Gemstone Types</div>
                          </div>
                        ) : (
                          <div className="md:col-span-2">
                            <div className="text-lg font-bold text-primary italic opacity-70">
                              No gemstones
                            </div>
                            <div className="text-secondary/70 text-xs">Gemstone Types</div>
                          </div>
                        )}
                        
                        {/* Stone Weight */}
                        {priceBreakup?.stoneWeightCt > 0 && (
                          <div>
                            <div className="text-lg font-bold text-primary">
                              {priceBreakup.stoneWeightCt} ct
                            </div>
                            <div className="text-secondary/70 text-xs">Stone Weight</div>
                          </div>
                        )}
                        
                        {/* Stone Value */}
                        {priceBreakup?.stoneValue > 0 && (
                          <div>
                            <div className="text-lg font-bold text-primary">
                              ₹{priceBreakup.stoneValue}
                            </div>
                            <div className="text-secondary/70 text-xs">Stone Value</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* General Details */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-secondary/50">
                <button
                  onClick={() => toggleAcc('general')}
                  className="w-full flex justify-between items-center px-5 py-4 text-left"
                >
                  <span className="font-semibold text-primary tracking-wide">🔄 GENERAL DETAILS</span>
                  <span className="text-secondary text-sm">{openAccordions.general ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {openAccordions.general && (
                    <motion.div
                      initial={{ height:0, opacity:0 }}
                      animate={{ height:'auto', opacity:1 }}
                      exit={{ height:0, opacity:0 }}
                      className="px-5 pb-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        {/* Jewellery Type */}
                        <div>
                          <div className="text-lg font-bold text-primary">
                            {productData.category || 'Not specified'}
                          </div>
                          <div className="text-secondary/70 text-xs">Jewellery Type</div>
                        </div>
                        
                        {/* Brand */}
                        <div>
                          <div className="text-lg font-bold text-primary">
                            AURAZA
                          </div>
                          <div className="text-secondary/70 text-xs">Brand</div>
                        </div>
                        
                        {/* Collection */}
                        <div>
                          <div className="text-lg font-bold text-primary">
                            {productData.tags?.[0] || productData.category || 'Premium Collection'}
                          </div>
                          <div className="text-secondary/70 text-xs">Collection</div>
                        </div>
                        
                        {/* Gender */}
                        <div>
                          <div className="text-lg font-bold text-primary">
                            {productData.customizationOptions?.gender || 
                             productData.gender || 
                             (productData.tags?.some(tag => tag.toLowerCase().includes('men')) ? 'Men' :
                              productData.tags?.some(tag => tag.toLowerCase().includes('women')) ? 'Women' :
                              'Unisex')}
                          </div>
                          <div className="text-secondary/70 text-xs">Gender</div>
                        </div>
                        
                        {/* Occasion */}
                        <div>
                          <div className="text-lg font-bold text-primary">
                            {productData.occasion ||
                             (productData.tags?.some(tag => tag.toLowerCase().includes('wedding')) ? 'Wedding' :
                              productData.tags?.some(tag => tag.toLowerCase().includes('casual')) ? 'Casual Wear' :
                              productData.tags?.some(tag => tag.toLowerCase().includes('party')) ? 'Party Wear' :
                              productData.tags?.some(tag => tag.toLowerCase().includes('formal')) ? 'Formal Wear' :
                              'Everyday Wear')}
                          </div>
                          <div className="text-secondary/70 text-xs">Occasion</div>
                        </div>
                        
                        {/* Availability */}
                        <div>
                          <div className="text-lg font-bold text-primary">
                            {productData.inStock && productData.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </div>
                          <div className="text-secondary/70 text-xs">Availability</div>
                        </div>
                        
                        {/* Stock Quantity */}
                        {productData.stock !== undefined && (
                          <div>
                            <div className="text-lg font-bold text-primary">
                              {productData.stock} units
                            </div>
                            <div className="text-secondary/70 text-xs">Stock</div>
                          </div>
                        )}
                        
                        {/* Price Type */}
                        <div>
                          <div className="text-lg font-bold text-primary capitalize">
                            {productData.priceType === 'weight-based' ? 'Weight Based' : 'Fixed Price'}
                          </div>
                          <div className="text-secondary/70 text-xs">Pricing Type</div>
                        </div>
                        
                        {/* Product Status */}
                        {productData.status && (
                          <div>
                            <div className="text-lg font-bold text-primary">
                              {productData.status}
                            </div>
                            <div className="text-secondary/70 text-xs">Status</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Description */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-secondary/50">
                <button
                  onClick={() => toggleAcc('desc')}
                  className="w-full flex justify-between items-center px-5 py-4 text-left"
                >
                  <span className="font-semibold text-primary tracking-wide">📝 DESCRIPTION</span>
                  <span className="text-secondary text-sm">{openAccordions.desc ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {openAccordions.desc && (
                    <motion.div
                      initial={{ height:0, opacity:0 }}
                      animate={{ height:'auto', opacity:1 }}
                      exit={{ height:0, opacity:0 }}
                      className="px-5 pb-5 text-sm text-secondary leading-relaxed"
                    >
                      {productData.description || 'No description provided.'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Side Preview with SKU - Matching Price Breakup styling */}
            <div className="bg-secondary/60 rounded-2xl border border-white/10 p-5 flex flex-col">
              {/* SKU ID - Same styling as Price Breakup */}
              <div className="mb-4 text-center">
                <span className="text-xs text-secondary/70 uppercase tracking-wider">SKU ID</span>
                <div className="text-sm font-bold text-primary font-mono mt-1 px-3 py-2 bg-primary/20 rounded-lg border border-white/10">
                  {productData?.sku || productData?._id || 'Not available'}
                </div>
              </div>

              {/* Product Image - Same styling as Price Breakup */}
              <div className="flex items-center justify-center flex-1">
                {images[0] && images[0] !== '/fallback.png' ? (
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={images[0]}
                      alt={productData?.name || 'Product'}
                      fill
                      className="object-cover rounded-xl"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="text-secondary">No image</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products (unchanged, now appears BELOW new tabs section) */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
