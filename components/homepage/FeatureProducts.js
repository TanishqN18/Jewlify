'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const bgByKey = {
  all: '/Images/All.png',
  necklaces: '/Images/Necklaces.png',
  rings: '/Images/Ring.png',
  earrings: '/Images/Earrings.png',
  bracelets: '/Images/Bracelet.png',
};

export default function FeaturedProducts({ products = [] }) {
  const base = [
    { key: 'Necklaces', emoji: '✨', headline: 'Exquisite Necklaces', sub: 'Handcrafted luxury, designed for timeless elegance' },
    { key: 'Rings', emoji: '💍', headline: 'Brilliant Rings', sub: 'Symbol of eternal love, crafted to perfection' },
    { key: 'Earrings', emoji: '💎', headline: 'Stunning Earrings', sub: 'Illuminate your beauty with sparkling elegance' },
    { key: 'Bracelets', emoji: '✨', headline: 'Elegant Bracelets', sub: 'Grace your wrist with sophisticated charm' },
  ];

  const tabs = ['All', ...base.map((b) => b.key)];
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = tabs.length;
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(
    () => setActiveIndex((i) => (i + 1) % totalSlides),
    [totalSlides]
  );
  const prevSlide = useCallback(
    () => setActiveIndex((i) => (i - 1 + totalSlides) % totalSlides),
    [totalSlides]
  );

  // More reliable autoplay: single timeout that resets each change
  const timerRef = useRef(null);
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % totalSlides);
    }, 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [isPlaying, activeIndex, totalSlides]);

  // Pause autoplay when tab is hidden; resume when visible
  useEffect(() => {
    const onVis = () => {
      const visible = document.visibilityState === 'visible';
      // Clear any pending timer when switching state
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      // Only play when visible
      if (visible) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const handlePrev = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    prevSlide();
  };
  const handleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    nextSlide();
  };

  const getSlideImage = (key) => {
    const k = (key || '').toLowerCase();
    return bgByKey[k] || '/Images/fallback.png';
  };

  return (
    <section
      id="luxury-slideshow"
      className="relative w-full bg-primary h-[340px] sm:h-[400px] md:h-[460px] lg:h-[500px] overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        {tabs.map((t, i) => {
          const meta = base.find((b) => b.key === t);
          const image = getSlideImage(t);

          return (
            i === activeIndex && (
              <motion.div
                key={t}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0">
                  <Image
                    src={image}
                    alt={meta?.headline || t}
                    fill
                    priority={t === 'All'}
                    sizes="100vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <div className="max-w-2xl w-full text-center rounded-2xl border border-yellow-500/30 bg-black/10 backdrop-blur-sm p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                    {meta?.emoji && <div className="mb-2 sm:mb-3 text-xl text-white">{meta.emoji}</div>}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3 text-white">
                      {meta?.headline || t}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg mb-6 text-white/85">
                      {meta?.sub || 'Browse premium picks by category'}
                    </p>
                    <Link
                      href={
                        t === 'All'
                          ? '/shop'
                          : {
                              pathname: '/shop',
                              // Send both original and slug to maximize compatibility with your shop filter
                              query: { category: t, slug: t.toLowerCase() },
                            }
                      }
                      prefetch
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold shadow-lg hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          );
        })}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 border border-white/20 text-white hover:bg-black/40 transition"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 border border-white/20 text-white hover:bg-black/40 transition"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {tabs.map((label, i) => (
          <button
            key={label}
            onClick={() => setActiveIndex(i)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/30 transition ${i === activeIndex ? 'bg-yellow-500' : 'bg-white/40'}`}
            aria-label={`Go to ${label}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30">
        <motion.div
          key={activeIndex}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-yellow-500/90"
        />
      </div>
    </section>
  );
}
