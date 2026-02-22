import { useHeaderStore } from "@/app/store/store";
import {
  FilterLoyalty,
  FilterStatus,
} from "@/components/ClientsFilters/ClientsFilters";
import { ClientWithOrders } from "@/types";
import { useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";
import { getLoyaltyInfo } from "@/helpers";

// export function useFilteredClients(clients: ClientWithOrders[]) {
//   const { query } = useSearchStore();
//   const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
//   const [loyaltyFilter, setLoyaltyFilter] = useState<FilterLoyalty>("all");
//   const debouncedSearch = useDebounce(query, 300);

//   const filtered = useMemo(() => {
//     return clients.filter((client) => {
//       // 1. Поиск
//       const searchTerm = debouncedSearch.toLowerCase();
//       const matchesSearch =
//         !searchTerm ||
//         [client.first_name, client.last_name, client.phone].some((f) =>
//           f?.toLowerCase().includes(searchTerm),
//         );

//       // 2. Статус (Активный/Неактивный)
//       const hasActive = client.orders?.some((o) => o.status === "active");
//       const matchesStatus =
//         statusFilter === "all" ||
//         (statusFilter === "active" ? hasActive : !hasActive);

//       // 3. Лояльность (Используем хелпер)
//       const orderCount = client.orders?.length || 0;
//       const loyalty = getLoyaltyInfo(orderCount);

//       const matchesLoyalty =
//         loyaltyFilter === "all" || loyalty.variant === loyaltyFilter;

//       return matchesSearch && matchesStatus && matchesLoyalty;
//     });
//   }, [clients, debouncedSearch, statusFilter, loyaltyFilter]);

//   return {
//     filtered,
//     statusFilter,
//     setStatusFilter,
//     loyaltyFilter,
//     setLoyaltyFilter,
//   };
// }

export function useFilteredClients(clients: ClientWithOrders[]) {
  const { query } = useHeaderStore();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [loyaltyFilter, setLoyaltyFilter] = useState<FilterLoyalty>("all");
  const debouncedSearch = useDebounce(query, 300);

  const filtered = useMemo(() => {
    return clients.filter((client) => {
      // 1. Поиск
      const searchTerm = debouncedSearch.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        [client.first_name, client.last_name, client.phone].some((f) =>
          f?.toLowerCase().includes(searchTerm),
        );

      // 2. Логика статуса (с учетом Blacklist)
      const isBlacklisted = client.is_blacklisted;
      const hasActive =
        client.orders?.some((o) => o.status === "active") || false;

      let matchesStatus = true;

      if (statusFilter !== "all") {
        if (statusFilter === "blocked") {
          // Если выбран фильтр "Черный список", показываем только их
          matchesStatus = isBlacklisted;
        } else {
          // Если выбраны "Активные" или "Ожидание",
          // заблокированные клиенты не должны в них попадать
          if (isBlacklisted) {
            matchesStatus = false;
          } else {
            matchesStatus = statusFilter === "active" ? hasActive : !hasActive;
          }
        }
      }

      // 3. Лояльность
      const orderCount = client.orders?.length || 0;
      const loyalty = getLoyaltyInfo(orderCount);
      const matchesLoyalty =
        loyaltyFilter === "all" || loyalty.variant === loyaltyFilter;

      return matchesSearch && matchesStatus && matchesLoyalty;
    });
  }, [clients, debouncedSearch, statusFilter, loyaltyFilter]);

  return {
    filtered,
    statusFilter,
    setStatusFilter,
    loyaltyFilter,
    setLoyaltyFilter,
  };
}
