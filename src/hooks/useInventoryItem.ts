import { getInventoryItem } from "@/services/inventoryService";
import { InventoryUI } from "@/types";
import useSWR from "swr";

const fetcher = async (id: string): Promise<InventoryUI> => {
  const data = await getInventoryItem(id);

  return {
    ...data,
    purchase_date: data.purchase_date
      ? new Date(data.purchase_date).toISOString().split("T")[0]
      : null,
  };
};

export function useInventoryItem(id?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ["inventory", id] : null,
    () => fetcher(id!),
  );

  return {
    item: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    mutate,
  };
}
