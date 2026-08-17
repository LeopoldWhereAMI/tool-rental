import { useEffect, useState } from "react";
import { RentalHistoryItem } from "@/types";

export function useItemHistory(itemId: string) {
  const [rentals, setRentals] = useState<RentalHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch(`/api/inventory/${itemId}/history`);

        if (!response.ok) {
          throw new Error("Ошибка загрузки истории");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Ошибка загрузки истории");
        }

        setRentals(result.data);
      } catch (e) {
        console.error("Ошибка при загрузке истории:", e);
      } finally {
        setLoading(false);
      }
    }

    if (itemId) loadHistory();
  }, [itemId]);

  return { rentals, loading };
}
