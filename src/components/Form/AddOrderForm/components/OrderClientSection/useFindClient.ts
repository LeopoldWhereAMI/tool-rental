// import { useMemo } from "react";
// import { Client } from "@/types";

// export default function useFindClient(
//   phone: string | undefined,
//   clients: Client[],
//   clientType: "individual" | "legal" | undefined,
// ) {
//   const normalizePhone = (phoneStr: string): string => {
//     return phoneStr.replace(/\D/g, "");
//   };

//   const { foundClients, isExactMatch } = useMemo(() => {
//     if (!phone) {
//       return { foundClients: [], isExactMatch: false };
//     }

//     const cleanPhone = normalizePhone(phone);
//     if (cleanPhone.length < 6) {
//       return { foundClients: [], isExactMatch: false };
//     }

//     const found = clients.filter((client) => {
//       const clientPhone = client.phone ? normalizePhone(client.phone) : "";

//       if (clientType && client.client_type !== clientType) {
//         return false;
//       }

//       return (
//         clientPhone.includes(cleanPhone) ||
//         cleanPhone.includes(clientPhone.slice(0, 6))
//       );
//     });

//     const exact = found.some(
//       (c) => normalizePhone(c.phone ?? "") === cleanPhone,
//     );

//     return { foundClients: found, isExactMatch: exact };
//   }, [phone, clients, clientType]);

//   return { foundClients, isExactMatch, normalizePhone };
// }

import { useMemo } from "react";
import { Client } from "@/types";

export default function useFindClient(
  searchValue: string | undefined,
  clients: Client[],
  clientType: "individual" | "legal" | undefined,
) {
  const normalizePhone = (phoneStr: string): string => {
    return phoneStr.replace(/\D/g, "");
  };

  const { foundClients, isExactMatch } = useMemo(() => {
    if (!searchValue) {
      return { foundClients: [], isExactMatch: false };
    }

    // 🔹 Если ищем по телефону
    if (clientType === "individual" || !clientType) {
      const cleanPhone = normalizePhone(searchValue);

      if (cleanPhone.length < 6) {
        return { foundClients: [], isExactMatch: false };
      }

      const found = clients.filter((client) => {
        if (client.client_type !== "individual") return false;

        const clientPhone = client.phone ? normalizePhone(client.phone) : "";

        return (
          clientPhone.includes(cleanPhone) ||
          cleanPhone.includes(clientPhone.slice(0, 6))
        );
      });

      const exact = found.some(
        (c) => normalizePhone(c.phone ?? "") === cleanPhone,
      );

      return { foundClients: found, isExactMatch: exact };
    }

    // 🔹 Если ищем компанию по названию
    if (clientType === "legal") {
      const normalized = searchValue.trim().toLowerCase();

      if (normalized.length < 2) {
        return { foundClients: [], isExactMatch: false };
      }

      const found = clients.filter((client) => {
        if (client.client_type !== "legal") return false;

        return client.company_name?.toLowerCase().includes(normalized);
      });

      const exact = found.some(
        (c) =>
          c.client_type === "legal" &&
          c.company_name?.toLowerCase() === normalized,
      );

      return { foundClients: found, isExactMatch: exact };
    }

    return { foundClients: [], isExactMatch: false };
  }, [searchValue, clients, clientType]);

  return { foundClients, isExactMatch, normalizePhone };
}
