"use client";

import styles from "./page.module.css";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import SearchInput from "@/components/SearchInput/SearchInput";
import { useEffect, useMemo, useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { useDebounce } from "@/hooks/useDebounce";
import StatusFilter from "@/components/ui/StatusFilter/StatusFilter";
import { INVENTORY_STATUS_LABELS } from "@/constants";
import InventoryList from "./components/InventoryList";
import CategoryChips from "@/components/ui/CategoryChips/CategoryChips";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = "table" | "grid";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const { items, loading, error, refresh } = useInventory();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const debouncedSearch = useDebounce(search, 300);

  // Объединенная фильтрация: Поиск + Категория + Статус
  const filteredItems = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.article?.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, debouncedSearch, categoryFilter, statusFilter]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 980) {
        setViewMode("grid");
      }
    };

    handleResize(); // при первом рендере
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <PageWrapper>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Инвентарь</h1>

          <span className={styles.countBadge}>{filteredItems.length}</span>
          <div className={styles.searchWrapper}>
            <SearchInput value={search} setSearch={setSearch} />
          </div>
        </div>
      </div>

      <div className={styles.inventoryListWrapper}>
        <div className={styles.headerTools}>
          <StatusFilter
            currentFilter={statusFilter}
            onFilterChange={setStatusFilter}
            labels={INVENTORY_STATUS_LABELS}
          />
          <CategoryChips value={categoryFilter} onChange={setCategoryFilter} />
          <div className={styles.viewSwitcher}>
            <button
              onClick={() => setViewMode("table")}
              className={`${styles.viewBtn} ${viewMode === "table" ? styles.activeView : ""}`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`${styles.viewBtn} ${viewMode === "grid" ? styles.activeView : ""}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
        <InventoryList
          viewMode={viewMode}
          items={filteredItems}
          loading={loading}
          error={error}
          refresh={refresh}
        />
      </div>
    </PageWrapper>
  );
}
