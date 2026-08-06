import { InventoryCreateInput } from "@/lib/validators/inventorySchema";
import { Inventory, OrderDetailsUI, OrderUI } from "@/types";

export async function loadInventory(): Promise<Inventory[]> {
  const response = await fetch("/api/inventory");

  if (!response.ok) {
    throw new Error("Ошибка загрузки инвентаря");
  }

  const result = await response.json();

  return result.data;
}

export async function getInventoryItem(id: string): Promise<Inventory> {
  const response = await fetch(`/api/inventory/${id}`);

  if (!response.ok) {
    throw new Error("Ошибка загрузки инструмента");
  }

  const result = await response.json();

  return result.data;
}

// Редактирование инструмента
export async function updateInventory(
  id: string,
  data: InventoryCreateInput,
): Promise<Inventory> {
  const response = await fetch(`/api/inventory/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      category: data.category,

      serial_number: data.serial_number,

      daily_price: data.daily_price,
      purchase_price: data.purchase_price,

      purchase_date: data.purchase_date
        ? new Date(data.purchase_date).getTime()
        : null,

      notes: data.notes,
    }),
  });

  if (!response.ok) {
    throw new Error("Ошибка обновления инструмента");
  }

  const result = await response.json();

  return result.data;
}

// Удаление одного инструмента по ID
export async function deleteInventory(id: string): Promise<void> {
  const response = await fetch(`/api/inventory/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Ошибка удаления инструмента");
  }
}

// Добавление инвентаря
export async function addInventory(item: InventoryCreateInput) {
  const response = await fetch("/api/inventory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: item.name,
      article: item.article,
      category: item.category,

      serial_number: item.serial_number,

      daily_price: item.daily_price,
      purchase_price: item.purchase_price,

      purchase_date: item.purchase_date
        ? new Date(item.purchase_date).getTime()
        : null,

      notes: item.notes,
    }),
  });

  if (!response.ok) {
    throw new Error("Ошибка добавления инструмента");
  }

  const result = await response.json();

  return result.data;
}

// Изменение статуса инструмента
export async function updateInventoryStatus(id: string, status: string) {
  const response = await fetch(`/api/inventory/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Ошибка изменения статуса");
  }

  const result = await response.json();

  return result.data;
}

// ТО инструмента
export const incrementMaintenanceCounters = async (
  inventoryId: string,
  days: number,
) => {
  const response = await fetch(`/api/inventory/${inventoryId}/maintenance`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      days,
    }),
  });

  if (!response.ok) {
    throw new Error("Ошибка обновления счетчика ТО");
  }
};

export const resetMaintenanceCounter = async (id: string) => {
  const response = await fetch(`/api/inventory/${id}/maintenance`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reset: true,
    }),
  });

  if (!response.ok) {
    throw new Error("Ошибка сброса счетчика ТО");
  }

  const result = await response.json();

  return result.data;
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
