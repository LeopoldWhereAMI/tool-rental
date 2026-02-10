import { supabase } from "@/lib/supabase";
import { Client, CreateClientInput } from "@/types";

// Добавление клиента
export async function createClientInSupabase(
  data: CreateClientInput,
): Promise<Client> {
  const { data: newClient, error } = await supabase
    .from("clients")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Ошибка при добавлении клиента:", error);
    throw new Error(error.message);
  }

  return newClient as Client;
}

// Загрузка всех клиентов (для селекта в форме заказа)
export async function loadClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("last_name");

  if (error) {
    console.error("Ошибка при загрузке клиентов:", error);
    throw new Error(error.message);
  }

  return data as Client[];
}

export async function upsertClient(
  data: Partial<CreateClientInput>,
): Promise<Client> {
  // Вырезаем только те поля, которые разрешено хранить по закону
  const safeData = {
    first_name: data.first_name,
    last_name: data.last_name,
    middle_name: data.middle_name,
    phone: data.phone,
  };

  const { data: client, error } = await supabase
    .from("clients")
    .upsert(safeData, {
      onConflict: "phone", // Убедись, что в Supabase на колонке phone стоит Unique constraint
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Ошибка при работе с клиентом:", error);
    throw new Error(error.message);
  }

  return client as Client;
}

// Загрузка клиента по ID вместе с его заказами
export const getClientById = async (id: string) => {
  const { data, error } = await supabase
    .from("clients")
    .select(
      `
      *,
      orders (
        id,
        order_number,
        status,
        total_price,
        start_date,
        end_date
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// Обновление данных клиента
export async function updateClient(
  id: string,
  data: Partial<CreateClientInput>,
): Promise<Client> {
  const { data: updatedClient, error } = await supabase
    .from("clients")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Ошибка при обновлении клиента:", error);
    throw new Error(error.message);
  }

  return updatedClient as Client;
}

// Удаление клиента
export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    console.error("Ошибка при удалении клиента:", error);
    throw new Error(error.message);
  }
}
