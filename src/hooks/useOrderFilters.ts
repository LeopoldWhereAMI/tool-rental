import { useMemo, useState } from "react";
import { OrderUI } from "@/types";

// Добавляем параметр внешнего поиска
export function useOrderFilters(
  orders: OrderUI[],
  externalSearchQuery: string,
) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Фильтр по статусу
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      // 2. Подготовка строки поиска
      const searchLower = (externalSearchQuery || "").toLowerCase().trim();
      if (!searchLower) return matchesStatus;

      // 3. Безопасные проверки полей (используем Optional Chaining и оператор ?? "")
      const orderNumber = order.order_number?.toString() || "";
      const phone = order.client?.phone || "";
      const lastName = order.client?.last_name || "";
      const firstName = order.client?.first_name || "";

      // Проверка инструментов (если есть)
      const matchesTools =
        order.tools?.some((tool) =>
          tool.name?.toLowerCase().includes(searchLower),
        ) ?? false;

      return (
        matchesStatus &&
        (orderNumber.includes(searchLower) ||
          phone.toLowerCase().includes(searchLower) ||
          lastName.toLowerCase().includes(searchLower) ||
          firstName.toLowerCase().includes(searchLower) ||
          matchesTools)
      );
    });
  }, [orders, statusFilter, externalSearchQuery]);

  return {
    statusFilter,
    setStatusFilter,
    filteredOrders,
  };
}
