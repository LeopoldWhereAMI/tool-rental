import { OrderDetailsUI, OrderUI, CreateOrderParams } from "@/types";

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
  console.log("UPDATE ORDER STATUS:", {
    orderId,
    newStatus,
    finalPrice,
    url: `/api/orders/${orderId}/status`,
  });
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

  if (!response.ok) {
    const text = await response.text();

    throw new Error(`Ошибка обновления статуса: ${response.status} ${text}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }
  console.log("STATUS RESPONSE:", response.status, response.url);
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

  return result;
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

export const createOrderExtension = async (
  orderId: string,
  days: number,
  amount: number,
) => {
  const response = await fetch(`/api/orders/${orderId}/extensions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      days,
      amount,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Ошибка создания продления");
  }

  return result.data;
};
