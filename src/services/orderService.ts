import {
  // Client,
  OrderDetailsUI,
  OrderUI,
  CreateOrderParams,
  // ClientPreview,
} from "@/types";

// ✅ Вспомогательная функция для преобразования Client в ClientPreview
// function toClientPreview(client: Client | null): ClientPreview {
//   if (!client) {
//     return {
//       id: "",
//       client_type: "individual",
//       display_name: "Клиент не указан",
//     };
//   }

//   const displayName =
//     client.client_type === "individual"
//       ? `${client.last_name || ""} ${client.first_name || ""}`.trim()
//       : client.company_name || "Компания не указана";

//   return {
//     id: client.id,
//     phone: client.phone,
//     client_type: client.client_type,
//     display_name: displayName,
//   };
// }

export const createOrder = async (orderData: CreateOrderParams) => {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Ошибка создания заказа");
  }

  return result.data;
};

// ✅ ИСПРАВЛЕННАЯ функция getOrderById
export const getOrderById = async (id: string): Promise<OrderDetailsUI> => {
  const response = await fetch(`/api/orders/${id}`);

  if (!response.ok) {
    throw new Error("Ошибка загрузки заказа");
  }

  const result = await response.json();

  return result.data;
};

export const loadAllOrders = async (): Promise<OrderUI[]> => {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error("Ошибка загрузки заказов");
  }

  const result = await response.json();

  return result.data;
};

export const getItemRentalHistory = async (itemId: string) => {
  const response = await fetch(`/api/inventory/${itemId}/rental-history`);

  if (!response.ok) {
    throw new Error("Ошибка загрузки истории аренды");
  }

  const result = await response.json();

  return result.data;
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: string,
  finalPrice?: number,
) => {
  const response = await fetch(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: newStatus,
      totalPrice: finalPrice,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
};

export const deleteOrderById = async (id: string) => {
  const response = await fetch(`/api/orders/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }
};

export async function updateOrderNotes(id: string, notes: string) {
  const response = await fetch(`/api/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notes,
    }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

export const returnOrderItem = async (orderId: string, itemId: string) => {
  const response = await fetch(
    `/api/orders/${orderId}/items/${itemId}/return`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "return",
      }),
    },
  );

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
};

export async function cancelItemReturn(orderId: string, itemId: string) {
  const response = await fetch(
    `/api/orders/${orderId}/items/${itemId}/return`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "cancel",
      }),
    },
  );

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}
