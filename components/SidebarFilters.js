'use client';

import { useState } from 'react';
import useFilterStore from './store/FilterStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const categories = ['All', 'Necklaces', 'Rings', 'Earrings', 'Bracelets'];
const priceRanges = [
  { label: 'All Prices', value: [0, 100000] },
  { label: 'Under ₹10,000', value: [0, 10000] },
  { label: '₹10,000 - ₹25,000', value: [10000, 25000] },
  { label: '₹25,000 - ₹50,000', value: [25000, 50000] },
  { label: 'Above ₹50,000', value: [50000, 100000] },
];

export default function FilterSidebar() {
  const { category, priceRange, setCategory, setPriceRange } = useFilterStore();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState({ categories: true, priceRange: true });

  const toggleSection = (section) => {
    setExpandedSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const activeFiltersCount = (category ? 1 : 0) + (priceRange[1] < 100000 ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-primary border border-accent rounded-xl p-4 transition-all duration-300 shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-500 rounded-lg">
            <FaFilter className="text-white text-xs" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">Filters</h2>
            <p className="text-xs text-secondary">Refine your search</p>
          </div>
        </div>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            {activeFiltersCount}
          </motion.div>
        )}
      </div>

      {/* Mobile Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full md:hidden mb-4 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 text-sm"
      >
        <FaFilter className="text-xs" />
        {isOpen ? 'Hide Filters' : 'Show Filters'}
        {isOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
      </motion.button>

      {/* Filter Content */}
      <div className={`space-y-4 ${isOpen ? 'block' : 'hidden'} md:block`}>
        
        {/* Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <button
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between p-2 bg-secondary rounded-lg hover:bg-accent transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📂</span>
              <div className="text-left">
                <h3 className="text-sm font-bold text-primary">Categories</h3>
                <p className="text-xs text-secondary">Choose jewelry type</p>
              </div>
            </div>
            {expandedSection.categories ? 
              <FaChevronUp className="text-secondary text-xs" /> : 
              <FaChevronDown className="text-secondary text-xs" />
            }
          </button>

          <AnimatePresence>
            {expandedSection.categories && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-1 overflow-hidden"
              >
                {categories.map((cat, index) => {
                  const isActive = (cat === 'All' && !category) || category === cat;
                  return (
                    <motion.button
                      key={cat}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => setCategory(cat === 'All' ? '' : cat)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`text-left px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                        isActive
                          ? 'bg-yellow-500 text-white shadow-sm'
                          : 'bg-secondary text-primary hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{cat}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Price Range Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2"
        >
          <button
            onClick={() => toggleSection('priceRange')}
            className="w-full flex items-center justify-between p-2 bg-secondary rounded-lg hover:bg-accent transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <div className="text-left">
                <h3 className="text-sm font-bold text-primary">Price Range</h3>
                <p className="text-xs text-secondary">Set your budget</p>
              </div>
            </div>
            {expandedSection.priceRange ? 
              <FaChevronUp className="text-secondary text-xs" /> : 
              <FaChevronDown className="text-secondary text-xs" />
            }
          </button>

          <AnimatePresence>
            {expandedSection.priceRange && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-1 overflow-hidden"
              >
                {priceRanges.map((range, index) => {
                  const isActive = priceRange[0] === range.value[0] && priceRange[1] === range.value[1];
                  return (
                    <motion.button
                      key={range.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => setPriceRange(range.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`text-left px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                        isActive
                          ? 'bg-yellow-600 text-white shadow-sm'
                          : 'bg-secondary text-primary hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{range.label}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.button
              onClick={() => {
                setCategory('');
                setPriceRange([0, 100000]);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <FaTimes className="text-xs" />
              Clear All Filters
            </motion.button>
          </motion.div>
        )}

        {/* Current Filters Display */}
        <AnimatePresence>
          {(category || priceRange[1] < 100000) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="p-3 bg-secondary rounded-lg border border-accent"
            >
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2 text-sm">
                <span className="text-xs">🏷️</span>
                Active Filters
              </h4>
              <div className="flex flex-wrap gap-1">
                {category && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm"
                  >
                    📂 {category}
                  </motion.span>
                )}
                {priceRange[1] < 100000 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm"
                  >
                    💰 ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Badge - Smaller */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="relative overflow-hidden"
        >
          <div className="p-3 bg-secondary rounded-lg border border-accent text-center relative">
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-2xl mb-1"
              >
                💎
              </motion.div>
              <h3 className="text-sm font-bold text-primary mb-0.5">Premium Quality</h3>
              <p className="text-xs text-secondary mb-1">Handcrafted with Love</p>
              <div className="flex justify-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                    className="text-yellow-400 text-xs"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
