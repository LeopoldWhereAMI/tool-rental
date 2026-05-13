import { useMemo } from "react";
import { InventoryUI } from "@/types";

interface UseInventoryFiltersProps {
  items: InventoryUI[];
  query: string;
  categoryFilter: string;
  statusFilter: string;
}

export function useInventoryFilters({
  items,
  query,
  categoryFilter,
  statusFilter,
}: UseInventoryFiltersProps) {
  const debouncedQuery = query.toLowerCase().trim();

  const filteredItems: InventoryUI[] = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();

    return items
      .filter((item) => {
        const matchesSearch =
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.article?.toLowerCase().includes(q);
        const matchesCategory =
          categoryFilter === "all" || item.category === categoryFilter;
        const matchesStatus =
          statusFilter === "all" || item.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .map((item) => ({
        ...item,
        // Преобразуем number в string для UI компонента
        purchase_date: item.purchase_date
          ? new Date(item.purchase_date).toLocaleDateString()
          : null,
      }));
  }, [items, debouncedQuery, categoryFilter, statusFilter]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category || "Без категории"))),
    [items],
  );

  return { filteredItems, categories };
}
