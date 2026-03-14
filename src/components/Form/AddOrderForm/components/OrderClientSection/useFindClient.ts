import { useMemo } from "react";
import { Client } from "@/types";

export default function useFindClient(
  phone: string | undefined,
  clients: Client[],
  clientType: "individual" | "legal" | undefined,
) {
  const normalizePhone = (phoneStr: string): string => {
    return phoneStr.replace(/\D/g, "");
  };

  const { foundClients, isExactMatch } = useMemo(() => {
    if (!phone) {
      return { foundClients: [], isExactMatch: false };
    }

    const cleanPhone = normalizePhone(phone);
    if (cleanPhone.length < 6) {
      return { foundClients: [], isExactMatch: false };
    }

    const found = clients.filter((client) => {
      const clientPhone = client.phone ? normalizePhone(client.phone) : "";

      // Фильтруем по типу клиента, если выбран
      if (clientType && client.client_type !== clientType) {
        return false;
      }

      // Проверяем совпадение начала номера
      return (
        clientPhone.includes(cleanPhone) ||
        cleanPhone.includes(clientPhone.slice(0, 6))
      );
    });

    const exact = found.some(
      (c) => normalizePhone(c.phone ?? "") === cleanPhone,
    );

    return { foundClients: found, isExactMatch: exact };
  }, [phone, clients, clientType]);

  return { foundClients, isExactMatch, normalizePhone };
}
