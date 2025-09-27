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
        <div className="col-span-full flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4 opacity-50">💎</div>
          <p className="text-secondary text-lg text-center">
            No products found matching your criteria.
          </p>
          <p className="text-secondary text-sm text-center mt-2 opacity-75">
            Try adjusting your filters or browse all categories.
          </p>
        </div>
      )}
    </div>
  );
}
