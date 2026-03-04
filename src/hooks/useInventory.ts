import { supabase } from "@/lib/supabase/supabase";
import { loadInventory } from "@/services/inventoryService";
import { InventoryUI } from "@/types";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export interface InventoryStats {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
}

const fetcher = async (): Promise<InventoryUI[]> => {
  const data = await loadInventory();
  return data.map((item) => ({
    ...item,
    purchase_date: item.purchase_date
      ? new Date(item.purchase_date).toISOString().split("T")[0]
      : null,
  }));
};

export const useInventory = () => {
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Получаем ID пользователя для ключа SWR
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    getUser();
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    userId ? ["inventory", userId] : null,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const stats: InventoryStats = useMemo(() => {
    if (!data || data.length === 0)
      return {
        total: 0,
        available: 0,
        rented: 0,
        maintenance: 0,
      };

    const total = data.length;
    const available = data.filter((i) => i.status === "available").length;
    const rented = data.filter((i) => i.status === "rented").length;
    const maintenance = data.filter((i) => i.status === "maintenance").length;

    return {
      total,
      available,
      rented,
      maintenance,
    };
  }, [data]);

  return {
    items: data ?? [],
    stats,
    loading: isLoading || (userId === null && !error),
    error: error?.message ?? null,
    refresh: mutate,
  };
};
