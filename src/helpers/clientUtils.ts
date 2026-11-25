import { Client, IndividualClient, LegalClient } from "@/types";

export function getClientDisplayName(client: Client | null): string {
  if (!client) return "Неизвестный клиент";

  if (client.client_type === "individual") {
    const parts = [
      client.last_name,
      client.first_name,
      client.middle_name,
    ].filter(Boolean);
    return parts.join(" ").trim();
  }

  return client.company_name || "Неизвестная компания";
}

export function getClientAddress(client: Client): string {
  if (client.client_type === "individual") {
    return client.registration_address || "";
  }

  return client.legal_address || "";
}

export function getClientIdentifiers(client: Client): {
  label: string;
  value: string;
}[] {
  const identifiers: { label: string; value: string }[] = [];

  if (client.client_type === "individual") {
    if (client.passport_series && client.passport_number) {
      identifiers.push({
        label: "Паспорт",
        value: `${client.passport_series} ${client.passport_number}`,
      });
    }
    return identifiers;
  }

  if (client.inn) {
    identifiers.push({
      label: "ИНН",
      value: client.inn || "",
    });
  }

  if (client.kpp) {
    identifiers.push({
      label: "КПП",
      value: client.kpp || "",
    });
  }

  if (client.ogrn) {
    identifiers.push({
      label: "ОГРН",
      value: client.ogrn || "",
    });
  }

  return identifiers;
}

export function formatINN(inn: string): string {
  if (!inn) return "";
  const cleaned = inn.replace(/\D/g, "");
  if (cleaned.length !== 12) return cleaned;
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
}

export function formatKPP(kpp: string): string {
  if (!kpp) return "";
  const cleaned = kpp.replace(/\D/g, "");
  if (cleaned.length !== 9) return cleaned;
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
}

export function formatOGRN(ogrn: string): string {
  if (!ogrn) return "";
  const cleaned = ogrn.replace(/\D/g, "");
  return cleaned;
}

export function getClientTypeIcon(
  clientType: "individual" | "legal",
): "User" | "Building2" {
  return clientType === "individual" ? "User" : "Building2";
}

export function getClientTypeLabel(clientType: "individual" | "legal"): string {
  return clientType === "individual" ? "Физическое лицо" : "Юридическое лицо";
}

export function getClientDescription(client: Client): string {
  const parts: string[] = [];

  if (client.client_type === "individual") {
    // ✅ TypeScript ЗНАЕТ, что client — это IndividualClient
    if (client.phone) parts.push(client.phone);
    if (client.registration_address) parts.push(client.registration_address);
  } else {
    // ✅ TypeScript ЗНАЕТ, что client — это LegalClient
    if (client.inn) parts.push(`ИНН: ${formatINN(client.inn)}`);
    if (client.phone) parts.push(client.phone);
  }

  return parts.join(" • ");
}

export function isClientComplete(client: Client): boolean {
  if (client.client_type === "individual") {
    return !!(client.first_name && client.last_name && client.phone);
  }

  return !!(client.company_name && client.inn && client.phone);
}

export function getMissingClientFields(client: Client): string[] {
  const missing: string[] = [];

  if (client.client_type === "individual") {
    // ✅ TypeScript ЗНАЕТ, что client — это IndividualClient
    if (!client.first_name) missing.push("Имя");
    if (!client.last_name) missing.push("Фамилия");
    if (!client.phone) missing.push("Телефон");
    if (!client.registration_address) missing.push("Адрес регистрации");
    if (!client.passport_series) missing.push("Серия паспорта");
    if (!client.passport_number) missing.push("Номер паспорта");
  } else {
    // ✅ TypeScript ЗНАЕТ, что client — это LegalClient
    if (!client.company_name) missing.push("Название компании");
    if (!client.inn) missing.push("ИНН");
    if (!client.phone) missing.push("Телефон");
    if (!client.legal_address) missing.push("Юридический адрес");
  }

  return missing;
}

export function filterClientsByType(
  clients: Client[],
  type: "individual",
): IndividualClient[];
export function filterClientsByType(
  clients: Client[],
  type: "legal",
): LegalClient[];
export function filterClientsByType(
  clients: Client[],
  type: "individual" | "legal",
): Client[] {
  return clients.filter((client) => client.client_type === type);
}

export function sortClients(clients: Client[]): {
  individual: IndividualClient[];
  legal: LegalClient[];
} {
  const individual = filterClientsByType(clients, "individual").sort((a, b) => {
    const aName = getClientDisplayName(a);
    const bName = getClientDisplayName(b);
    return aName.localeCompare(bName, "ru");
  });

  const legal = filterClientsByType(clients, "legal").sort((a, b) => {
    const aName = getClientDisplayName(a);
    const bName = getClientDisplayName(b);
    return aName.localeCompare(bName, "ru");
  });

  return { individual, legal };
}

export function isIndividualClient(client: Client): client is IndividualClient {
  return client.client_type === "individual";
}

export function isLegalClient(client: Client): client is LegalClient {
  return client.client_type === "legal";
}
