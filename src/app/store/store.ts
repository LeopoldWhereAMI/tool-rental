import { create } from "zustand";

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  resetSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => {
  // ✅ Функции создаются один раз, не пересоздаются
  const setQuery = (query: string) => set({ query });
  const resetSearch = () => set({ query: "" });

  return {
    query: "",
    setQuery,
    resetSearch,
  };
});
