import { loadInventory } from "@/services/inventoryService";
import { InventoryUI } from "@/types";
import useSWR from "swr";

const fetcher = async (): Promise<InventoryUI[]> => {
  const data = await loadInventory();

  // Преобразование даты
  return data.map((item) => ({
    ...item,
    purchase_date: item.purchase_date
      ? new Date(item.purchase_date).toISOString().split("T")[0]
      : null,
  }));
};

export const useInventory = () => {
  const { data, error, isLoading, mutate } = useSWR("inventory", fetcher, {
    revalidateOnFocus: false,
  });

  return {
    items: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refresh: mutate,
  };
};
