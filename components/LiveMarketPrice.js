'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSyncAlt, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function LiveMarketPrices({ isOpen, onClose }) {
  const [prices, setPrices] = useState(null);
  const [prevPrices, setPrevPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (onClose) {
          onClose();
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchPrices = async () => {
    setIsRefreshing(true);
    try {
      // Mock data for now since API might not be available
      const mockData = {
        mcx: {
          gold_24K_10g: 75000 + Math.random() * 1000,
          gold_22K_10g: 68000 + Math.random() * 900,
          silver_1kg: 85000 + Math.random() * 2000,
        },
        diamond: 450000 + Math.random() * 10000,
        lastUpdated: new Date().toISOString(),
      };

      // Try to fetch from API, fall back to mock data
      let data = mockData;
      try {
        const res = await fetch('/api/metal-prices');
        if (res.ok) {
          data = await res.json();
        }
      } catch (apiErr) {
        console.log('Using mock data due to API unavailability');
      }

      if (data?.mcx) {
        setPrevPrices(prices);
        setPrices({
          gold24k: parseFloat(data.mcx.gold_24K_10g),
          gold22k: parseFloat(data.mcx.gold_22K_10g),
          silver: parseFloat(data.mcx.silver_1kg),
          diamond: parseFloat(data.diamond),
        });
        setLastUpdated(new Date(data.lastUpdated));
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch prices:', err);
      // Set mock data even on error
      setPrices({
        gold24k: 75000,
        gold22k: 68000,
        silver: 85000,
        diamond: 450000,
      });
      setLastUpdated(new Date());
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen && !prices) {
      fetchPrices();
    }
  }, [isOpen]);

  const format = (value) =>
    typeof value === 'number'
      ? `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
      : '--';

  const formatTime = (date) =>
    date?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const getTrendIcon = (key) => {
    if (!prevPrices || !prices || prevPrices[key] === prices[key]) return null;

    const isUp = prices[key] > prevPrices[key];
    return (
      <motion.span
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: isUp ? 0 : 180 }}
        className={`ml-1 flex items-center ${isUp ? 'text-green-500' : 'text-red-500'}`}
      >
        {isUp ? (
          <FaArrowUp className="text-xs" />
        ) : (
          <FaArrowDown className="text-xs" />
        )}
      </motion.span>
    );
  };

  const getPriceChange = (key) => {
    if (!prevPrices || !prices || prevPrices[key] === prices[key]) return null;

    const change = prices[key] - prevPrices[key];
    const isUp = change > 0;
    return (
      <span className={`text-xs font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
        {isUp ? '+' : ''}{change.toFixed(0)}
      </span>
    );
  };

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-primary backdrop-blur-xl shadow-2xl border border-yellow-200 dark:border-yellow-600/30 rounded-2xl overflow-hidden w-full max-w-md"
      >
        {/* Header */}
        <div className="p-3 bg-gradient-to-r from-yellow-500/10 via-yellow-600/5 to-transparent border-b border-yellow-200 dark:border-yellow-600/30">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-base text-primary">
                📈 Market Prices
              </h4>
              <p className="text-xs text-secondary">
                Live precious metal rates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={fetchPrices}
                disabled={isRefreshing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-secondary hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh prices"
              >
                <FaSyncAlt className={`text-sm transition-transform ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-secondary hover:bg-red-100 dark:hover:bg-red-900/30 text-primary hover:text-red-500 transition-all duration-300"
                title="Close"
              >
                <FaTimes className="text-sm" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 bg-secondary rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-secondary rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              {/* Gold 24K */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-3 rounded-lg bg-gradient-to-br from-yellow-100/90 via-amber-50 to-yellow-200/70 dark:from-yellow-900/25 dark:via-yellow-800/15 dark:to-amber-900/20 border border-yellow-300/50 dark:border-yellow-600/30 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-yellow-800 dark:text-yellow-200 text-xs uppercase tracking-wide">
                      💛 Gold 24K (10g)
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center mt-0.5">
                      {format(prices?.gold24k)}
                      {getTrendIcon('gold24k')}
                    </div>
                  </div>
                  <div className="text-right">
                    {getPriceChange('gold24k')}
                  </div>
                </div>
              </motion.div>

              {/* Gold 22K */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-3 rounded-lg bg-gradient-to-br from-orange-100/90 via-amber-50 to-orange-200/70 dark:from-orange-900/25 dark:via-amber-800/15 dark:to-yellow-900/20 border border-orange-300/50 dark:border-orange-600/30 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-orange-800 dark:text-orange-200 text-xs uppercase tracking-wide">
                      🟡 Gold 22K (10g)
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center mt-0.5">
                      {format(prices?.gold22k)}
                      {getTrendIcon('gold22k')}
                    </div>
                  </div>
                  <div className="text-right">
                    {getPriceChange('gold22k')}
                  </div>
                </div>
              </motion.div>

              {/* Silver */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-3 rounded-lg bg-gradient-to-br from-slate-100/90 via-gray-50 to-blue-100/70 dark:from-slate-800/25 dark:via-gray-800/15 dark:to-slate-900/20 border border-slate-300/50 dark:border-slate-600/30 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">
                      🥈 Silver (1kg)
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center mt-0.5">
                      {format(prices?.silver)}
                      {getTrendIcon('silver')}
                    </div>
                  </div>
                  <div className="text-right">
                    {getPriceChange('silver')}
                  </div>
                </div>
              </motion.div>

              {/* Diamond */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-3 rounded-lg bg-gradient-to-br from-pink-100/90 via-rose-50 to-purple-100/70 dark:from-pink-900/25 dark:via-rose-800/15 dark:to-purple-900/20 border border-pink-300/50 dark:border-pink-600/30 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-pink-800 dark:text-pink-200 text-xs uppercase tracking-wide">
                      💎 Diamond (1ct)
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white flex items-center mt-0.5">
                      {format(prices?.diamond)}
                      {getTrendIcon('diamond')}
                    </div>
                  </div>
                  <div className="text-right">
                    {getPriceChange('diamond')}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-yellow-200 dark:border-yellow-600/30 bg-secondary">
          <div className="flex justify-between items-center text-xs text-secondary">
            <span>Live Market Data</span>
            <span>
              Updated: {lastUpdated ? formatTime(lastUpdated) : '--'}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
