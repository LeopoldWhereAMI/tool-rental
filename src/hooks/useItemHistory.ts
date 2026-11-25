import { useEffect, useState } from "react";
import { RentalHistoryItem } from "@/types";

export function useItemHistory(itemId: string) {
  const [rentals, setRentals] = useState<RentalHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      const startTime = Date.now();

      setIsPageLoading(true);

      try {
        const response = await fetch(
          `/api/inventory/${itemId}/history?page=${page}`,
        );

        if (!response.ok) {
          throw new Error("Ошибка загрузки истории");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Ошибка загрузки истории");
        }

        setRentals(result.data);
        setTotalPages(result.pagination.totalPages);
      } catch (e) {
        console.error("Ошибка при загрузке истории:", e);
      } finally {
        setLoading(false);

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(200 - elapsed, 0);

        setTimeout(() => {
          setIsPageLoading(false);
        }, remaining);
      }
    }

    if (itemId) {
      loadHistory();
    }
  }, [itemId, page]);

  return {
    rentals,
    loading,
    isPageLoading,
    page,
    totalPages,
    setPage,
  };
}
