import { loadInventory } from "@/services/inventoryService";
import { InventoryUI } from "@/types";
import { useMemo } from "react";
import useSWR from "swr";

// 1. Описываем интерфейс статистики
export interface InventoryStats {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
  availablePct: number;
  totalTrend: number;
  rentedTrend: number;
  maintenanceTrend: number;
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
  const { data, error, isLoading, mutate } = useSWR("inventory", fetcher, {
    revalidateOnFocus: false,
  });

  const stats: InventoryStats = useMemo(() => {
    if (!data || data.length === 0)
      return {
        total: 0,
        available: 0,
        rented: 0,
        maintenance: 0,
        availablePct: 0,
        totalTrend: 0,
        rentedTrend: 0,
        maintenanceTrend: 0,
      };

    const total = data.length;
    const available = data.filter((i) => i.status === "available").length;
    const rented = data.filter((i) => i.status === "rented").length;
    const maintenance = data.filter((i) => i.status === "maintenance").length;

    const now = new Date();
    const startOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).getTime();

    const previousItems = data.filter(
      (i) => new Date(i.created_at).getTime() < startOfCurrentMonth,
    );

    const prevTotal = previousItems.length;
    const prevRented = previousItems.filter(
      (i) => i.status === "rented",
    ).length;
    const prevMaintenance = previousItems.filter(
      (i) => i.status === "maintenance",
    ).length;

    const calcTrend = (curr: number, prev: number) =>
      prev === 0 ? 0 : parseFloat((((curr - prev) / prev) * 100).toFixed(1));

    return {
      total,
      available,
      rented,
      maintenance,
      availablePct: Math.round((available / total) * 100),
      totalTrend: calcTrend(total, prevTotal),
      rentedTrend: calcTrend(rented, prevRented),
      maintenanceTrend: calcTrend(maintenance, prevMaintenance),
    };
  }, [data]);

  return {
    items: data ?? [],
    stats,
    loading: isLoading,
    error: error?.message ?? null,
    refresh: mutate,
  };
};
