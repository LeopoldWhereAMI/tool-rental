import { useSearchStore } from "@/app/store/store";
import {
  FilterLoyalty,
  FilterStatus,
} from "@/components/ClientsFilters/ClientsFilters";
import { ClientWithOrders } from "@/types";
import { useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";
import { getLoyaltyInfo } from "@/helpers";

const normalize = (v?: string) => v?.toLowerCase() ?? "";

export function useFilteredClients(clients: ClientWithOrders[]) {
  const { query } = useSearchStore();

  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [loyaltyFilter, setLoyaltyFilter] = useState<FilterLoyalty>("all");

  const debouncedSearch = useDebounce(query, 300);

  const filtered = useMemo(() => {
    const searchTerm = normalize(debouncedSearch);

    return clients.filter((client) => {
      // ===== SEARCH =====
      const searchFields =
        client.client_type === "individual"
          ? [
              client.phone,
              client.first_name,
              client.last_name,
              client.middle_name,
            ]
          : [client.phone, client.company_name, client.inn];

      const matchesSearch =
        !searchTerm ||
        searchFields.some((field) =>
          normalize(field || "").includes(searchTerm),
        );

      // ===== STATUS =====
      const isBlacklisted = client.is_blacklisted ?? false;

      const hasActive =
        client.orders?.some((o) => o.status === "active") ?? false;

      let matchesStatus = true;

      if (statusFilter !== "all") {
        if (statusFilter === "blocked") {
          matchesStatus = isBlacklisted;
        } else {
          matchesStatus =
            !isBlacklisted &&
            (statusFilter === "active" ? hasActive : !hasActive);
        }
      }

      // ===== LOYALTY =====
      const orderCount = client.orders?.length ?? 0;
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
