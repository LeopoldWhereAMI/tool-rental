import { useEffect, useState } from "react";
import { getItemRentalHistory } from "@/services/orderService";
import { RentalHistoryItem } from "@/types";

export function useItemHistory(itemId: string) {
  const [rentals, setRentals] = useState<RentalHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getItemRentalHistory(itemId);
        setRentals(data);
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
