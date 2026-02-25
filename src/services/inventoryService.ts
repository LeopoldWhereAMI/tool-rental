import { supabase } from "@/lib/supabase";
import { InventoryCreateInput } from "@/lib/validators/inventorySchema";
import { Inventory, OrderDetailsUI, OrderUI } from "@/types";

// Загрузка инвентаря на страницу
export async function loadInventory(): Promise<Inventory[]> {
  const { data, error } = await supabase
    .from("inventory")
    .select(
      "id, name, category, daily_price,  status, serial_number,image_url, article,purchase_price, purchase_date",
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

  const { article: _article, ...rest } = data;

  const formattedData = {
    ...rest,
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

// ТО инструмента
export const incrementMaintenanceCounters = async (
  inventoryId: string,
  days: number,
) => {
  const { error } = await supabase.rpc("increment_work_days", {
    item_id: inventoryId,
    days_to_add: days,
  });
  if (error) throw error;
};

export const resetMaintenanceCounter = async (id: string) => {
  const { data, error } = await supabase
    .from("inventory")
    .update({
      work_days_count: 0,
      last_maintenance_date: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Ошибка при сбросе счетчика ТО:", error);
    throw error;
  }

  return data;
};

export const processOrderMaintenance = async (
  order: OrderUI | OrderDetailsUI,
) => {
  const items =
    ("order_items" in order ? order.order_items : order.tools) || [];
  if (!items.length) return;

  const maintenancePromises = items.map(async (item) => {
    // 1. Определяем ID (используем логику глубокого поиска, которую мы отладили)
    let toolId: string | undefined;

    if ("inventory" in item && item.inventory) {
      toolId = item.inventory.id;
    } else if ("id" in item) {
      toolId = item.id;
    }

    if (!toolId) {
      console.warn("⚠️ Пропущен айтем без ID инструмента:", item);
      return;
    }

    // 2. Расчет дней (используем даты из айтема или общие из заказа)
    const sDate = item.start_date || order.start_date;
    const eDate = item.end_date || order.end_date;

    let daysToWork = 1;
    if (sDate && eDate) {
      const start = new Date(sDate);
      const end = new Date(eDate);
      const diffMs = Math.abs(end.getTime() - start.getTime());
      daysToWork = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) || 1;
    }

    // 3. Используем ВАШ существующий сервис
    return incrementMaintenanceCounters(toolId, daysToWork);
  });

  return Promise.all(maintenancePromises);
};
