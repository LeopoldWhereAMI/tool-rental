import { Client, ClientWithOrders, CreateClientInput } from "@/types";

export async function createClient(data: CreateClientInput) {
  const response = await fetch("/api/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Ошибка создания клиента");
  }

  return response.json();
}

export async function upsertClient(data: CreateClientInput): Promise<Client> {
  const response = await fetch("/api/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Ошибка создания клиента");
  }

  return response.json();
}

export async function loadClients(): Promise<ClientWithOrders[]> {
  const response = await fetch("/api/clients");

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Ошибка при загрузке клиентов");
  }

  return data;
}

export const getClientById = async (id: string) => {
  const response = await fetch(`/api/clients/${id}`);

  if (!response.ok) {
    throw new Error("Ошибка загрузки клиента");
  }

  return response.json();
};

export async function updateClient(
  id: string,
  data: Partial<CreateClientInput>,
): Promise<Client> {
  const response = await fetch(`/api/clients/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Ошибка обновления клиента");
  }

  return response.json();
}

export async function deleteClient(id: string): Promise<void> {
  const response = await fetch(`/api/clients/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Ошибка удаления клиента");
  }
}
