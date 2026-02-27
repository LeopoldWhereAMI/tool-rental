"use client";

import styles from "./OrdersToolbar.module.css";
import StatusFilter from "@/components/ui/StatusFilter/StatusFilter";
import SearchInput from "@/components/SearchInput/SearchInput";

import ViewToggle from "@/components/ui/ViewToggle/ViewToggle";
import { ViewMode } from "@/types";
import { useSearchStore } from "@/app/store/store";

interface OrdersToolbarProps {
  currentFilter: string;
  onFilterChange: (value: string) => void;
  labels: Record<string, string>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isMobile?: boolean;
}

export default function OrdersToolbar({
  currentFilter,
  onFilterChange,
  labels,
  viewMode,
  setViewMode,
  isMobile,
}: OrdersToolbarProps) {
  const { query, setQuery } = useSearchStore();

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <SearchInput value={query} setSearch={setQuery} />
      </div>
      <div className={styles.right}>
        <StatusFilter
          currentFilter={currentFilter}
          onFilterChange={onFilterChange}
          labels={labels}
        />
        {!isMobile && (
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        )}
      </div>
    </div>
  );
}
