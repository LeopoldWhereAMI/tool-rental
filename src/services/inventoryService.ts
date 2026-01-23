import { supabase } from "@/lib/supabase";
import { InventoryCreateInput } from "@/lib/validators/inventorySchema";
import { Inventory } from "@/types";

// Загрузка инвентаря на страницу
export async function loadInventory(): Promise<Inventory[]> {
  const { data, error } = await supabase
    .from("inventory")
    .select(
      "id, name, category, daily_price, quantity, status, serial_number, article,purchase_price, purchase_date",
    )
    .order("name");

  if (error) {
    console.error("Ошибка загрузки инвентаря:", error);
    throw new Error(error.message);
  }

  return data as Inventory[];
}

//  Добавление одного инструмента по ID
export async function getInventoryItem(id: string): Promise<Inventory> {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Ошибка загрузки инструмента:", error);
    throw new Error(error.message);
  }

  return data as Inventory;
}

// Редактирование инструмента
export async function updateInventory(
  id: string,
  data: InventoryCreateInput,
): Promise<Inventory> {
  const now = new Date().toISOString();

  const formattedData = {
    ...data,
    purchase_date: data.purchase_date
      ? new Date(data.purchase_date).getTime()
      : null,
    updated_at: now,
  };

  const { data: updatedItem, error } = await supabase
    .from("inventory")
    .update(formattedData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Ошибка при обновлении инструмента:", error);
    throw new Error(error.message);
  }

  return updatedItem as Inventory;
}

// Удаление одного инструмента по ID
export async function deleteInventory(id: string): Promise<void> {
  const { error } = await supabase.from("inventory").delete().eq("id", id);

  if (error) {
    console.error("Ошибка при удалении инструмента:", error);
    throw new Error(error.message);
  }
}

// Добавление инвентаря
export async function addInventory(item: InventoryCreateInput) {
  const now = new Date().toISOString();

  const formattedData = {
    ...item,
    purchase_date: item.purchase_date
      ? new Date(item.purchase_date).getTime()
      : null,
    status: "available",
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("inventory")
    .insert([formattedData])
    .select()
    .single();

  if (error) {
    console.error("Ошибка при добавлении инструмента:", error);
    throw new Error(error.message);
  }

  return data;
}

// Изменение статуса инструмента
export const updateInventoryStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from("inventory")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  return data;
};
