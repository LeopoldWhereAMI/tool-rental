// import { useState, useEffect, useMemo } from "react";
// import { getClientById } from "@/services/clientsService";
// import { getLoyaltyInfo } from "@/helpers";
// import { ClientWithOrders, OrderUI } from "@/types";

// export function useClientDetails(id: string) {
//   const [client, setClient] = useState<ClientWithOrders | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     getClientById(id)
//       .then(setClient)
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [id]);

//   const insights = useMemo(() => {
//     const orders = client?.orders || [];
//     const totalOrders = orders.length;
//     const totalSpent = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);

//     const onTimeOrders = orders.filter((o) => o.status !== "late").length;
//     const reliability =
//       totalOrders > 0 ? Math.round((onTimeOrders / totalOrders) * 100) : 100;

//     return {
//       totalSpent,
//       totalOrders,
//       reliability,
//       onTimeRate: reliability,
//       loyalty: getLoyaltyInfo(totalOrders),
//     };
//   }, [client]);

//   const sortedOrders = useMemo(() => {
//     if (!client?.orders) return { activeOrders: [], historyOrders: [] };

//     return client.orders
//       .slice()
//       .sort((a, b) => Number(b.order_number) - Number(a.order_number))
//       .reduce(
//         (acc, order) => {
//           const isActive = ["rented", "active", "pending"].includes(
//             order.status,
//           );
//           if (isActive) acc.activeOrders.push(order);
//           else acc.historyOrders.push(order);
//           return acc;
//         },
//         { activeOrders: [] as OrderUI[], historyOrders: [] as OrderUI[] },
//       );
//   }, [client]);

//   return {
//     client,
//     loading,
//     insights,
//     activeOrders: sortedOrders.activeOrders,
//     historyOrders: sortedOrders.historyOrders,
//   };
// }

import useSWR from "swr";
import { useMemo } from "react";
import { getClientById } from "@/services/clientsService";
import { getLoyaltyInfo } from "@/helpers";
import { OrderUI, ClientWithOrders } from "@/types";

export function useClientDetails(id: string) {
  const swrKey = id ? `client-${id}` : null;

  // Добавляем тип <ClientWithOrders> для SWR
  const {
    data: client,
    error,
    isLoading,
    mutate,
  } = useSWR<ClientWithOrders>(swrKey, () => getClientById(id));

  const insights = useMemo(() => {
    const orders: OrderUI[] = client?.orders || [];
    const totalOrders = orders.length;

    // Типизируем sum и o
    const totalSpent = orders.reduce(
      (sum: number, o: OrderUI) => sum + (o.total_price || 0),
      0,
    );

    const onTimeOrders = orders.filter(
      (o: OrderUI) => o.status !== "late",
    ).length;
    const reliability =
      totalOrders > 0 ? Math.round((onTimeOrders / totalOrders) * 100) : 100;

    return {
      totalSpent,
      totalOrders,
      reliability,
      onTimeRate: reliability,
      loyalty: getLoyaltyInfo(totalOrders),
    };
  }, [client]);

  const sortedOrders = useMemo(() => {
    if (!client?.orders) return { activeOrders: [], historyOrders: [] };

    return (
      client.orders
        .slice()
        // Типизируем a и b
        .sort(
          (a: OrderUI, b: OrderUI) =>
            Number(b.order_number) - Number(a.order_number),
        )
        // Типизируем acc и order
        .reduce(
          (acc, order: OrderUI) => {
            const isActive = ["rented", "active", "pending"].includes(
              order.status,
            );
            if (isActive) acc.activeOrders.push(order);
            else acc.historyOrders.push(order);
            return acc;
          },
          { activeOrders: [] as OrderUI[], historyOrders: [] as OrderUI[] },
        )
    );
  }, [client]);

  return {
    client: client ?? null,
    loading: isLoading,
    error,
    insights,
    activeOrders: sortedOrders.activeOrders,
    historyOrders: sortedOrders.historyOrders,
    refresh: mutate,
  };
}
