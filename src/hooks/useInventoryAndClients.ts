"use client";

import { useEffect, useMemo } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { loadInventory } from "@/services/inventoryService";
import { loadClients } from "@/services/clientsService";
import { Inventory, Client } from "@/types";

export function useInventoryAndClients() {
  const {
    data: allInventory = [],
    error: inventoryError,
    isLoading: isInventoryLoading,
  } = useSWR<Inventory[]>("inventory", loadInventory);

  const {
    data: clients = [],
    error: clientsError,
    isLoading: isClientsLoading,
  } = useSWR<Client[]>("clients", loadClients);

  // 🔔 Тосты ошибок
  useEffect(() => {
    if (inventoryError) {
      console.error("Ошибка загрузки инвентаря:", inventoryError);
      toast.error("Ошибка загрузки инвентаря");
    }
    if (clientsError) {
      console.error("Ошибка загрузки клиентов:", clientsError);
      toast.error("Ошибка загрузки клиентов");
    }
  }, [inventoryError, clientsError]);

  // ✅ Только доступный инвентарь
  const inventory = useMemo(
    () => allInventory.filter((i) => i.status === "available"),
    [allInventory],
  );

  // 🗺️ Map для быстрых lookup'ов по id
  const inventoryMap = useMemo(() => {
    return new Map(inventory.map((i) => [i.id, i]));
  }, [inventory]);

  return {
    inventory,
    inventoryMap,
    clients,
    isLoading: isInventoryLoading || isClientsLoading,
    error: inventoryError || clientsError,
  };
}
