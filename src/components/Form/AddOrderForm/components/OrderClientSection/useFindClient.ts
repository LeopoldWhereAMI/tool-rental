import { Client } from "@/types";
import { useMemo } from "react";

const normalizePhone = (v: string) => v.replace(/\D/g, "");

export default function useFindClient(
  watchedPhone: string | undefined,
  clients: Client[],
) {
  const foundClients = useMemo(() => {
    if (!watchedPhone) return [];

    const input = normalizePhone(watchedPhone);

    if (input.length < 7) return [];

    return clients.filter((c) => {
      const clientPhone = normalizePhone(c.phone ?? "");

      return clientPhone.startsWith(input);
    });
  }, [watchedPhone, clients]);

  const normalizedWatched = normalizePhone(watchedPhone ?? "");

  const isExactMatch = foundClients.some(
    (c) => normalizePhone(c.phone ?? "") === normalizedWatched,
  );

  return { foundClients, isExactMatch, normalizePhone };
}
