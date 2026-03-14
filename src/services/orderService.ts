// import { supabase } from "@/lib/supabase/supabase";
// import {
//   Client,
//   Inventory,
//   OrderDetailsUI,
//   OrderTool,
//   OrderUI,
//   RentalHistoryItem,
// } from "@/types";

// interface CreateOrderParams {
//   client_id: string;
//   total_price: number;
//   security_deposit: number | null;
//   items: {
//     id: string;
//     daily_price: number;
//     start_date: string;
//     end_date: string;
//   }[];
// }

// export const createOrder = async (orderData: CreateOrderParams) => {
//   try {
//     const { data, error } = await supabase.rpc("create_order_v2", {
//       p_client_id: orderData.client_id,
//       p_total_price: orderData.total_price,
//       p_security_deposit: orderData.security_deposit,
//       p_items: orderData.items,
//     });

//     if (error) {
//       if (error.code === "23505") {
//         throw new Error("Один из инструментов в этом заказе уже забронирован.");
//       }
//       throw error;
//     }

//     return data;
//   } catch (error) {
//     console.error("Order Service RPC Error:", error);
//     throw error;
//   }
// };

// export const calculateOrderTotal = (
//   start: string,
//   end: string,
//   dailyPrice: number,
// ): number => {
//   const startDate = new Date(start);
//   startDate.setHours(0, 0, 0, 0);

//   const endDate = new Date(end);
//   endDate.setHours(0, 0, 0, 0);

//   const diffTime = endDate.getTime() - startDate.getTime();

//   let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//   if (diffDays < 0) return 0;
//   if (diffDays === 0) diffDays = 1;

//   return diffDays * dailyPrice;
// };

// interface SupabaseOrderRow {
//   id: string;
//   order_number: string;
//   status: string;
//   total_price: number;
//   start_date: string;
//   end_date: string;
//   created_at: string;
//   client: Client;
//   order_items: {
//     id: string;
//     price_at_time: number;
//     start_date: string;
//     end_date: string;
//     item_status: "active" | "returned";
//     actual_return_date: string | null;
//     inventory: Inventory;
//   }[];
// }

// export const getOrderById = async (id: string): Promise<OrderDetailsUI> => {
//   const { data, error } = await supabase
//     .from("orders")
//     .select(
//       `
//       *,
//       client:clients(*),
//       order_items(
//         id,
//         price_at_time,
//         start_date,
//         end_date,
//         item_status,
//         actual_return_date,
//         inventory(*)
//       )
//     `,
//     )
//     .eq("id", id)
//     .single();

//   if (error) throw error;

//   const orderData = data as unknown as SupabaseOrderRow;
//   if (!orderData) throw new Error("Order not found");

//   const tools: OrderTool[] = (orderData.order_items || [])
//     .filter((item) => item.inventory)
//     .map((item) => ({
//       ...item.inventory!,
//       price_at_time: item.price_at_time,
//       start_date: item.start_date,
//       end_date: item.end_date,
//     }));

//   const mainInventory = tools[0] ?? {
//     name: "Не указан",
//   };

//   return {
//     ...orderData,
//     inventory: mainInventory,
//     tools,
//   };
// };

// interface SupabaseAllOrdersRow {
//   id: string;
//   total_price: number;
//   start_date: string;
//   end_date: string;
//   order_number: string;
//   status: string;
//   client: {
//     id: string;
//     last_name: string;
//     first_name: string;
//     middle_name?: string;
//     phone?: string;
//     client_type?: "individual" | "legal";
//     company_name?: string | null;
//   } | null;
//   order_items: {
//     id: string;
//     price_at_time: number;
//     start_date: string;
//     end_date: string;
//     inventory: {
//       id: string;
//       name: string;
//       serial_number: string;
//       image_url: string | null;
//     } | null;
//   }[];
// }

// export const loadAllOrders = async (): Promise<OrderUI[]> => {
//   const { data, error } = await supabase
//     .from("orders")
//     .select(
//       `
//       id,
//       total_price,
//       start_date,
//       end_date,
//       order_number,
//       status,
//       client:clients(id, last_name, first_name, middle_name, phone, client_type, company_name),
//       order_items(

//         price_at_time,
//         start_date,
//         end_date,
//         inventory( id, name, image_url)
//       )
//     `,
//     )
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.error("Error loading orders:", error);
//     throw error;
//   }

//   const rawData = data as unknown as SupabaseAllOrdersRow[];

//   return rawData.map((order) => {
//     const tools = (order.order_items || [])
//       .filter((item) => item.inventory)
//       .map((item) => ({
//         id: item.inventory!.id,
//         name: item.inventory!.name,
//         image_url: item.inventory!.image_url,
//         price_at_time: item.price_at_time,
//         start_date: item.start_date,
//         end_date: item.end_date,
//       }));

//     let mainInventoryName = "Не указан";
//     if (tools.length === 1) {
//       mainInventoryName = tools[0].name;
//     } else if (tools.length > 1) {
//       mainInventoryName = `${tools[0].name} +${tools.length - 1}`;
//     }

//     return {
//       id: order.id,
//       order_number: order.order_number,
//       status: order.status,
//       total_price: order.total_price,
//       start_date: order.start_date,
//       end_date: order.end_date,

//       client: order.client || {
//         id: "",
//         last_name: "Не указан",
//         first_name: "",
//         middle_name: undefined,
//       },
//       inventory: { name: mainInventoryName },
//       tools: tools,
//     };
//   });
// };

// interface OrderItemResponse {
//   id: string;
//   price_at_time: number;
//   start_date: string;
//   end_date: string;
//   orders: {
//     id: string;
//     status: string;
//     clients: Client | null;
//   } | null;
// }

// export const getItemRentalHistory = async (
//   itemId: string,
// ): Promise<RentalHistoryItem[]> => {
//   const { data, error } = await supabase
//     .from("order_items")
//     .select(
//       `
//       id,
//       price_at_time,
//       start_date,
//       end_date,
//       orders (
//         id,
//         status,
//         clients (
//           id,
//           first_name,
//           last_name,
//           middle_name,
//           phone
//         )
//       )
//     `,
//     )
//     .eq("inventory_id", itemId)
//     .order("start_date", { ascending: false })
//     .limit(5);

//   if (error) {
//     console.error("Supabase Error:", error);
//     throw error;
//   }

//   const responseData = (data as unknown as OrderItemResponse[]) || [];

//   return responseData.map((item) => ({
//     id: item.id,
//     order_id: item.orders?.id,
//     start_date: item.start_date,
//     end_date: item.end_date,
//     total_price: item.price_at_time,
//     status: item.orders?.status,
//     client_name: item.orders?.clients
//       ? `${item.orders.clients.last_name} ${item.orders.clients.first_name}`.trim()
//       : "Клиент не указан",
//   }));
// };

// export const updateOrderStatus = async (
//   orderId: string,
//   newStatus: string,
//   finalPrice?: number,
// ) => {
//   const { error } = await supabase.rpc("update_order_status_v2", {
//     p_order_id: orderId,
//     p_new_status: newStatus,
//     p_total_price: finalPrice,
//   });

//   if (error) {
//     console.error("Ошибка при обновлении статуса заказа через RPC:", error);
//     throw error;
//   }
// };

// export const deleteOrderById = async (id: string) => {
//   const { error } = await supabase.from("orders").delete().eq("id", id);

//   if (error) {
//     console.error("Error deleting order:", error);
//     throw error;
//   }
// };

// export async function updateOrderNotes(id: string, notes: string) {
//   const { data, error } = await supabase
//     .from("orders")
//     .update({ notes })
//     .eq("id", id);

//   if (error) throw error;
//   return data;
// }

// export const returnOrderItem = async (orderId: string, itemId: string) => {
//   const { data, error } = await supabase
//     .from("order_items")
//     .update({
//       item_status: "returned",
//       actual_return_date: new Date().toISOString(),
//     })
//     .eq("id", itemId)
//     .eq("order_id", orderId)
//     .select()
//     .single();

//   if (error) {
//     console.error("Ошибка при завершении аренды инструмента:", error);
//     throw error;
//   }

//   return data;
// };

// export async function cancelItemReturn(orderId: string, itemId: string) {
//   const { data, error } = await supabase
//     .from("order_items")
//     .update({
//       item_status: "rented",
//       actual_return_date: null,
//     })
//     .eq("id", itemId)
//     .eq("order_id", orderId)
//     .select();

//   if (error) {
//     console.error("Ошибка при отмене возврата инструмента:", error);
//     throw error;
//   }

//   return data;
// }

import { supabase } from "@/lib/supabase/supabase";
import {
  Client,
  Inventory,
  OrderDetailsUI,
  OrderTool,
  OrderUI,
  RentalHistoryItem,
  CreateOrderParams,
  SupabaseOrderRow,
  SupabaseAllOrdersRow,
  OrderItemResponse,
  ClientPreview,
} from "@/types";

// ✅ Вспомогательная функция для преобразования Client в ClientPreview
function toClientPreview(client: Client | null): ClientPreview {
  if (!client) {
    return {
      id: "",
      client_type: "individual",
      display_name: "Клиент не указан",
    };
  }

  const displayName =
    client.client_type === "individual"
      ? `${client.last_name || ""} ${client.first_name || ""}`.trim()
      : client.company_name || "Компания не указана";

  return {
    id: client.id,
    phone: client.phone,
    client_type: client.client_type,
    display_name: displayName,
  };
}

export const createOrder = async (orderData: CreateOrderParams) => {
  try {
    const { data, error } = await supabase.rpc("create_order_v2", {
      p_client_id: orderData.client_id,
      p_total_price: orderData.total_price,
      p_security_deposit: orderData.security_deposit,
      p_items: orderData.items,
    });

    if (error) {
      if (error.code === "23505") {
        throw new Error("Один из инструментов в этом заказе уже забронирован.");
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Order Service RPC Error:", error);
    throw error;
  }
};

export const calculateOrderTotal = (
  start: string,
  end: string,
  dailyPrice: number,
): number => {
  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate.getTime() - startDate.getTime();

  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 0;
  if (diffDays === 0) diffDays = 1;

  return diffDays * dailyPrice;
};

// ✅ ИСПРАВЛЕННАЯ функция getOrderById
export const getOrderById = async (id: string): Promise<OrderDetailsUI> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      client:clients(*),
      order_items(
        id,
        price_at_time,
        start_date,
        end_date,
        item_status,
        actual_return_date,
        inventory(*)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const orderData = data as unknown as SupabaseOrderRow;
  if (!orderData) throw new Error("Order not found");

  // ✅ Фильтруем и трансформируем инструменты
  const tools: OrderTool[] = (orderData.order_items || [])
    .filter((item) => item.inventory)
    .map((item) => ({
      ...item.inventory!,
      price_at_time: item.price_at_time,
      start_date: item.start_date,
      end_date: item.end_date,
    }));

  const mainInventory = tools[0] ?? {
    id: "",
    created_at: "",
    name: "Не указан",
    category: "",
    daily_price: 0,
    purchase_price: 0,
    purchase_date: 0,
    status: "available" as const,
    notes: "",
    updated_at: "",
    serial_number: "",
    article: "",
    work_days_count: 0,
    total_work_days: 0,
    maintenance_interval_days: 0,
    last_maintenance_date: null,
  };

  // ✅ Преобразуем client в правильный Client тип
  const client: Client = orderData.client as Client;

  return {
    ...orderData,
    client, // ✅ Теперь это правильный Client (IndividualClient | LegalClient)
    inventory: mainInventory,
    tools,
  };
};

// ✅ ИСПРАВЛЕННАЯ функция loadAllOrders
export const loadAllOrders = async (): Promise<OrderUI[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      total_price,
      start_date,
      end_date,
      order_number,
      status,
      client:clients(id, last_name, first_name, middle_name, phone, client_type, company_name),
      order_items(
        id,
        price_at_time, 
        start_date,
        end_date,
        inventory(id, name, serial_number, image_url)
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading orders:", error);
    throw error;
  }

  const rawData = data as unknown as SupabaseAllOrdersRow[];

  return rawData.map((order) => {
    const tools = (order.order_items || [])
      .filter((item) => item.inventory)
      .map((item) => ({
        id: item.inventory!.id,
        name: item.inventory!.name,
        serial_number: item.inventory!.serial_number,
        image_url: item.inventory!.image_url,
        price_at_time: item.price_at_time,
        start_date: item.start_date,
        end_date: item.end_date,
      }));

    let mainInventoryName = "Не указан";
    if (tools.length === 1) {
      mainInventoryName = tools[0].name;
    } else if (tools.length > 1) {
      mainInventoryName = `${tools[0].name} +${tools.length - 1}`;
    }

    // ✅ Используем вспомогательную функцию для преобразования в ClientPreview
    const clientPreview = toClientPreview(order.client as Client | null);

    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total_price: order.total_price,
      start_date: order.start_date,
      end_date: order.end_date,
      client: clientPreview, // ✅ Теперь совместимо
      inventory: { name: mainInventoryName },
      tools,
    };
  });
};

// ✅ ИСПРАВЛЕННАЯ функция getItemRentalHistory
export const getItemRentalHistory = async (
  itemId: string,
): Promise<RentalHistoryItem[]> => {
  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
      id,
      price_at_time,
      start_date,
      end_date,
      orders (
        id,
        status,
        clients (
          id,
          first_name,
          last_name,
          middle_name,
          phone,
          client_type,
          company_name
        )
      )
    `,
    )
    .eq("inventory_id", itemId)
    .order("start_date", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Supabase Error:", error);
    throw error;
  }

  const responseData = (data as unknown as OrderItemResponse[]) || [];

  return responseData.map((item) => {
    // ✅ Преобразуем в правильный Client тип
    const client = item.orders?.clients as Client | null;

    let clientName = "Клиент не указан";
    if (client) {
      if (client.client_type === "individual") {
        clientName =
          `${client.last_name || ""} ${client.first_name || ""}`.trim();
      } else {
        clientName = client.company_name || "Компания не указана";
      }
    }

    return {
      id: item.id,
      order_id: item.orders?.id,
      start_date: item.start_date,
      end_date: item.end_date,
      total_price: item.price_at_time,
      status: item.orders?.status,
      client_name: clientName,
    };
  });
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: string,
  finalPrice?: number,
) => {
  const { error } = await supabase.rpc("update_order_status_v2", {
    p_order_id: orderId,
    p_new_status: newStatus,
    p_total_price: finalPrice,
  });

  if (error) {
    console.error("Ошибка при обновлении статуса заказа через RPC:", error);
    throw error;
  }
};

export const deleteOrderById = async (id: string) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export async function updateOrderNotes(id: string, notes: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({ notes })
    .eq("id", id);

  if (error) throw error;
  return data;
}

export const returnOrderItem = async (orderId: string, itemId: string) => {
  const { data, error } = await supabase
    .from("order_items")
    .update({
      item_status: "returned",
      actual_return_date: new Date().toISOString(),
    })
    .eq("id", itemId)
    .eq("order_id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Ошибка при завершении аренды инструмента:", error);
    throw error;
  }

  return data;
};

export async function cancelItemReturn(orderId: string, itemId: string) {
  const { data, error } = await supabase
    .from("order_items")
    .update({
      item_status: "rented",
      actual_return_date: null,
    })
    .eq("id", itemId)
    .eq("order_id", orderId)
    .select();

  if (error) {
    console.error("Ошибка при отмене возврата инструмента:", error);
    throw error;
  }

  return data;
}
