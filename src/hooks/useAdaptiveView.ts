import { useSyncExternalStore, useCallback } from "react";
import { ViewMode } from "@/types";
import { useViewStore } from "@/app/store/useViewStore";

const subscribe = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};

export function useAdaptiveView(pageKey: string) {
  const { pageModes, setPageMode } = useViewStore();

  const isMobile = useSyncExternalStore(
    subscribe,
    () => window.innerWidth <= 1300,
    () => false,
  );

  const handleSetViewMode = useCallback(
    (mode: ViewMode) => {
      setPageMode(pageKey, mode);
    },
    [pageKey, setPageMode],
  );

  const savedMode = pageModes[pageKey] as ViewMode | undefined;

  const currentMode: ViewMode = isMobile ? "cards" : savedMode || "table";

  return {
    viewMode: currentMode,
    setViewMode: handleSetViewMode,
    isMobile,
  };
}
