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
