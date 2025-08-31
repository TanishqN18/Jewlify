import { create } from 'zustand';

const useFilterStore = create((set) => ({
  category: '',
  priceRange: [0, 100000],
  tags: [], 
  sort: '',
  setCategory: (category) => set({ category }),
  setPriceRange: (range) => set({ priceRange: range }),
  setTags: (tags) => set({ tags }),
  toggleTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag)
        ? state.tags.filter((t) => t !== tag)
        : [...state.tags, tag],
    })),
  setSort: (sort) => set({ sort }),
  clearFilters: () =>
    set({
      category: '',
      priceRange: [0, 100000],
      tags: [],
      sort: '',
    }),
}));

export default useFilterStore;
