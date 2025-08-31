'use client';

import { useEffect, useState } from 'react';
import useFilterStore from '../components/store/FilterStore';
import ProductCard from './ProductCard';

export default function ProductGrid({ allProducts }) {
  const { category, priceRange } = useFilterStore();
  const [filtered, setFiltered] = useState(allProducts);

  useEffect(() => {
    const filtered = allProducts.filter((p) => {
      const matchesCategory = category ? p.category === category : true;
      const matchesPrice = p.price <= priceRange[1];
      return matchesCategory && matchesPrice;
    });
    setFiltered(filtered);
  }, [category, priceRange, allProducts]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {filtered.length > 0 ? (
        filtered.map((product) => <ProductCard key={product._id} product={product} />)
      ) : (
        <p className="text-gray-500 dark:text-gray-300">No products found.</p>
      )}
    </div>
  );
}
