import { useEffect, useState } from "react";

export function useRentedInventory() {
  const [rentedIds, setRentedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRentedInventory = async () => {
      try {
        const response = await fetch("/api/inventory/rented");

        if (!response.ok) {
          throw new Error("Не удалось получить арендованный инвентарь");
        }

        const result = await response.json();

        setRentedIds(result.data ?? []);
      } catch (error) {
        console.error("Ошибка загрузки арендованного инвентаря:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRentedInventory();
  }, []);

  return {
    rentedIds,
    loading,
  };
}
