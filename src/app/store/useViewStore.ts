// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
// import { ViewMode } from "@/types";

// interface ViewState {
//   viewMode: ViewMode;
//   setViewMode: (mode: ViewMode) => void;
// }

// export const useViewStore = create<ViewState>()(
//   persist(
//     (set) => ({
//       viewMode: "table", // значение по умолчанию
//       setViewMode: (mode) => set({ viewMode: mode }),
//     }),
//     {
//       name: "inventory-view-storage", // уникальный ключ в localStorage
//       storage: createJSONStorage(() => localStorage),
//     },
//   ),
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ViewMode } from "@/types";

interface ViewState {
  // Храним режимы для разных страниц: { inventory: "table", orders: "grid" }
  pageModes: Record<string, ViewMode>;
  // Универсальный экшен
  setPageMode: (pageKey: string, mode: ViewMode) => void;
}

export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      pageModes: {}, // Изначально пусто, будем брать дефолт при рендере
      setPageMode: (pageKey, mode) =>
        set((state) => ({
          pageModes: { ...state.pageModes, [pageKey]: mode },
        })),
    }),
    {
      name: "app-view-settings", // Общее название для всех страниц
    },
  ),
);
