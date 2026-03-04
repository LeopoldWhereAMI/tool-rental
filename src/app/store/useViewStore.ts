import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ViewMode } from "@/types";

interface ViewState {
  pageModes: Record<string, ViewMode>;

  setPageMode: (pageKey: string, mode: ViewMode) => void;
}

export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      pageModes: {},
      setPageMode: (pageKey, mode) =>
        set((state) => ({
          pageModes: { ...state.pageModes, [pageKey]: mode },
        })),
    }),
    {
      name: "app-view-settings",
    },
  ),
);
