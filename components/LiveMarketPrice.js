'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSyncAlt } from 'react-icons/fa';

export default function LiveMarketPrices() {
  const [prices, setPrices] = useState(null);
  const [prevPrices, setPrevPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPrices = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/metal-prices');
      const data = await res.json();

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
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  const format = (value) =>
    typeof value === 'number'
      ? `₹${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
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
      <span className={`ml-1 text-xs ${isUp ? 'text-green-500' : 'text-red-500'}`}>
        {isUp ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border dark:border-neutral-700 border-gray-200 px-4 py-5 bg-white dark:bg-neutral-900 shadow-md w-full max-w-3xl mx-auto space-y-4 text-[15px]"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          Live Market Prices
        </h4>
        <button
          onClick={fetchPrices}
          disabled={isRefreshing}
          className="text-xs flex items-center gap-1 px-2 py-1 border rounded-md bg-gray-100 dark:bg-neutral-800 hover:bg-yellow-100 dark:hover:bg-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSyncAlt className={`transition-transform ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading prices...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-4 grid-cols-2 text-sm">
          <div className="flex flex-col space-y-1 text-yellow-600 dark:text-yellow-400">
            <span className="font-semibold">Gold 24K</span>
            <span>
              {format(prices.gold24k)} {getTrendIcon('gold24k')}
            </span>
          </div>

          <div className="flex flex-col space-y-1 text-yellow-500 dark:text-yellow-300">
            <span className="font-semibold">Gold 22K</span>
            <span>
              {format(prices.gold22k)} {getTrendIcon('gold22k')}
            </span>
          </div>

          <div className="flex flex-col space-y-1 text-blue-600 dark:text-blue-400">
            <span className="font-semibold">Silver</span>
            <span>
              {format(prices.silver)} {getTrendIcon('silver')}
            </span>
          </div>

          <div className="flex flex-col space-y-1 text-pink-600 dark:text-pink-400">
            <span className="font-semibold">Diamond</span>
            <span>
              {format(prices.diamond)} {getTrendIcon('diamond')}
            </span>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 italic text-center">
        Last updated: {lastUpdated ? formatTime(lastUpdated) : '--'} | Auto-refresh every 10 min
      </p>
    </motion.div>
  );
}
