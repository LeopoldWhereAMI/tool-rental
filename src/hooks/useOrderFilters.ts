import { useMemo, useState } from "react";
import { OrderUI } from "@/types";

export function useOrderFilters(orders: OrderUI[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const searchLower = searchQuery.toLowerCase().trim();
      if (!searchLower) return matchesStatus;

      return (
        matchesStatus &&
        (order.order_number?.toString().includes(searchLower) ||
          order.client?.phone?.toLowerCase().includes(searchLower) ||
          order.client?.last_name?.toLowerCase().includes(searchLower))
      );
    });
  }, [orders, statusFilter, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredOrders,
  };
}
