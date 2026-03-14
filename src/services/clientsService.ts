import { supabase } from "@/lib/supabase/supabase";
import { Client, ClientWithOrders, CreateClientInput } from "@/types";

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

export async function upsertClient(data: CreateClientInput): Promise<Client> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Пользователь не авторизован");

  // 📌 ВАРИАНТ 1: Физическое лицо
  if (data.client_type === "individual") {
    const { data: client, error } = await supabase
      .from("clients")
      .upsert(
        {
          phone: data.phone,
          user_id: user.id,
          client_type: "individual",
          first_name: data.first_name,
          last_name: data.last_name,
          middle_name: data.middle_name || null,
          company_name: null,
          inn: null,
          kpp: null,
          ogrn: null,
          legal_address: null,
        },
        {
          onConflict: "user_id,phone",
          ignoreDuplicates: false,
        },
      )
      .select()
      .single();

    if (error) {
      console.error("Ошибка при работе с клиентом:", error);
      throw new Error(error.message);
    }

    return client as Client;
  }

  // 📌 ВАРИАНТ 2: Юридическое лицо
  if (data.client_type === "legal") {
    const { data: client, error } = await supabase
      .from("clients")
      .upsert(
        {
          phone: data.phone,
          user_id: user.id,
          client_type: "legal",
          first_name: null,
          last_name: null, // ✅ ИЗ COMPANY_NAME!
          middle_name: null,
          company_name: data.company_name,
          inn: data.inn,
          kpp: data.kpp || null,
          ogrn: data.ogrn || null,
          legal_address: data.legal_address || null,
        },
        {
          onConflict: "user_id,phone",
          ignoreDuplicates: false,
        },
      )
      .select()
      .single();

    if (error) {
      console.error("Ошибка при работе с клиентом:", error);
      throw new Error(error.message);
    }

    return client as Client;
  }

  throw new Error("Неизвестный тип клиента");
}

export async function loadClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select(
      `
      *,
      orders (
        id,
        status,
        total_price
      )
    `,
    )
    .order("last_name");

  if (error) {
    console.error("Ошибка при загрузке клиентов:", error);
    throw new Error(error.message);
  }

  return data as ClientWithOrders[];
}

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
        order_items (
          start_date,
            end_date
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

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

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    console.error("Ошибка при удалении клиента:", error);
    throw new Error(error.message);
  }
}
