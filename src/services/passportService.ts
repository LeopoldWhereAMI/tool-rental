import { PassportInput } from "@/lib/validators/orderSchema";

export async function getPassport(clientId: string) {
  const response = await fetch(`/api/client-passports/${clientId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Ошибка загрузки паспорта");
  }

  return response.json();
}

export async function upsertPassport(
  clientId: string,
  passport: PassportInput,
) {
  const response = await fetch("/api/client-passports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      ...passport,
    }),
  });

  if (!response.ok) {
    throw new Error("Ошибка сохранения паспорта");
  }

  return response.json();
}
