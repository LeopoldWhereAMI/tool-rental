"use client";

import styles from "./OrdersToolbar.module.css";
import StatusFilter from "@/components/ui/StatusFilter/StatusFilter";

import SearchInput from "@/components/SearchInput/SearchInput";
import { useHeaderStore } from "@/app/store/store";

interface OrdersToolbarProps {
  currentFilter: string;
  onFilterChange: (value: string) => void;
  labels: Record<string, string>;
}

export default function OrdersToolbar({
  currentFilter,
  onFilterChange,
  labels,
}: OrdersToolbarProps) {
  const { query, setQuery } = useHeaderStore();

  return (
    <div className={styles.toolbar}>
      <SearchInput value={query} setSearch={setQuery} />
      <StatusFilter
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
        labels={labels}
      />
    </div>
  );
}
