'use client';

import useFilterStore from '../components/store/filterstore';

export default function FilterSidebar() {
  const { category, setCategory, priceRange, setPriceRange } = useFilterStore();

  return (
    <div className="p-4 border rounded-xl dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Filters</h2>

      {/* Category filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded p-2 dark:bg-neutral-800 dark:text-white"
        >
          <option value="">All</option>
          <option value="rings">Rings</option>
          <option value="necklaces">Necklaces</option>
          <option value="bracelets">Bracelets</option>
        </select>
      </div>

      {/* Price range filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Price</label>
        <input
          type="range"
          min={0}
          max={100000}
          step={500}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          className="w-full"
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Up to ₹{priceRange[1]}</p>
      </div>
    </div>
  );
}
