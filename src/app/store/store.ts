// import { create } from "zustand";

// interface SearchState {
//   query: string;
//   setQuery: (query: string) => void;
//   resetSearch: () => void;
// }

// export const useSearchStore = create<SearchState>((set) => ({
//   query: "",
//   setQuery: (query) => set({ query }),
//   resetSearch: () => set({ query: "" }),
// }));

import { create } from "zustand";
import { ReactNode } from "react";

interface HeaderState {
  // Поиск (из твоего примера)
  query: string;
  setQuery: (query: string) => void;
  resetSearch: () => void;

  // Динамический контент
  title: string;
  subtitle: string;
  actions: ReactNode | null;
  customSearch: ReactNode | null; // Если на странице нужен специфический поиск

  // Метод для массового обновления (удобно для useEffect)
  setHeader: (config: {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    customSearch?: ReactNode;
  }) => void;

  // Сброс к начальному состоянию
  resetHeader: () => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
  resetSearch: () => set({ query: "" }),

  title: "",
  subtitle: "",
  actions: null,
  customSearch: null,

  setHeader: (config) =>
    set({
      title: config.title,
      subtitle: config.subtitle || "",
      actions: config.actions || null,
      customSearch: config.customSearch || null,
    }),

  resetHeader: () =>
    set({
      query: "",
      title: "",
      subtitle: "",
      actions: null,
      customSearch: null,
    }),
}));
