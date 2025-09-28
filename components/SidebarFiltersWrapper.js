'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useFilterStore from './store/FilterStore';
import FilterSidebar from './SidebarFilters';

const normalizeCategory = (val) => {
  if (!val) return '';
  const v = String(val).toLowerCase();
  const map = {
    all: '', necklaces: 'Necklaces', rings: 'Rings', earrings: 'Earrings', bracelets: 'Bracelets',
  };
  return map[v] ?? '';
};

export default function FilterSidebarWrapper({ initialCategory = '' }) {
  const searchParams = useSearchParams();
  const setCategory = useFilterStore((s) => s.setCategory);

  useEffect(() => {
    const fromUrl =
      searchParams.get('category') ||
      searchParams.get('slug') ||
      initialCategory;

    setCategory(normalizeCategory(fromUrl));
  }, [searchParams, initialCategory, setCategory]);

  return (
    <div className="bg-primary transition-all duration-300">
      <FilterSidebar />
    </div>
  );
}
