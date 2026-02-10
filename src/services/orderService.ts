import { supabase } from "@/lib/supabase";
import {
  Client,
  // CreateOrderDTO,
  // DetailedOrderResponse,
  Inventory,
  OrderDetailsUI,
  OrderTool,
  // OrderTool,
  OrderUI,
} from "@/types";

// Обновленная версия createOrder с использованием RPC
interface CreateOrderParams {
  client_id: string;
  total_price: number;
  items: {
    id: string;
    daily_price: number;
    start_date: string;
    end_date: string;
  }[];
}

export const createOrder = async (orderData: CreateOrderParams) => {
  try {
    // Вызываем созданную в Supabase функцию RPC
    const { data, error } = await supabase.rpc("create_order_v2", {
      p_client_id: orderData.client_id,
      p_total_price: orderData.total_price,
      p_items: orderData.items, // Теперь тут объекты с датами
    });

    if (error) {
      // Обработка специфических ошибок БД (например, ограничение UNIQUE)
      if (error.code === "23505") {
        throw new Error("Один из инструментов в этом заказе уже забронирован.");
      }
      throw error;
    }

    return data; // Возвращает { id: "..." }
  } catch (error) {
    console.error("Order Service RPC Error:", error);
    throw error;
  }
};

/**
 * Расчет стоимости на основе дат и суточной цены
 */
export const calculateOrderTotal = (
  start: string,
  end: string,
  dailyPrice: number,
): number => {
  // 1. Создаем объекты дат, сбрасывая время в 00:00:00 для точности расчета дней
  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  // 2. Считаем разницу в миллисекундах
  const diffTime = endDate.getTime() - startDate.getTime();

  // 3. Переводим в дни. Используем Math.round, так как мы сбросили время.

  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 4. Бизнес-логика:

  if (diffDays < 0) return 0;
  if (diffDays === 0) diffDays = 1;

  return diffDays * dailyPrice;
};

// Тип для вложенного объекта в запросе
interface SupabaseOrderRow {
  id: string;
  order_number: string;
  status: string;
  total_price: number;
  start_date: string;
  end_date: string;
  created_at: string;
  client: Client; // Используем ваш интерфейс Client
  order_items: {
    id: string;
    price_at_time: number;
    start_date: string;
    end_date: string;
    inventory: Inventory; // Используем ваш интерфейс Inventory
  }[];
}

// Получение заказа по ID с детализацией инструментов
// export const getOrderById = async (
//   id: string,
// ): Promise<DetailedOrderResponse> => {
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
//         inventory(*)
//       )
//     `,
//     )
//     .eq("id", id)
//     .single();

//   if (error) throw error;

//   const orderData = data as unknown as SupabaseOrderRow;

//   if (!orderData) throw new Error("Order not found");

//   const tools: OrderTool[] = (orderData.order_items || []).map((item) => ({
//     ...item.inventory,
//     price_at_time: item.price_at_time,
//     start_date: item.start_date,
//     end_date: item.end_date,
//   }));

//   return {
//     ...orderData,

//     inventory: orderData.order_items?.[0]?.inventory || null,
//     tools: tools,
//   };
// };

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
        inventory(*)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const orderData = data as unknown as SupabaseOrderRow;
  if (!orderData) throw new Error("Order not found");

  const tools: OrderTool[] = (orderData.order_items || [])
    .filter((item) => item.inventory)
    .map((item) => ({
      ...item.inventory!, // весь Inventory
      price_at_time: item.price_at_time,
      start_date: item.start_date,
      end_date: item.end_date,
    }));

  const mainInventory = tools[0] ?? {
    name: "Не указан",
  };

  return {
    ...orderData,
    inventory: mainInventory, // ✅ всегда объект
    tools,
  };
};

interface SupabaseAllOrdersRow {
  id: string;
  total_price: number;
  start_date: string;
  end_date: string;
  order_number: string;
  status: string;
  client: {
    last_name: string;
    first_name: string;
    middle_name?: string;
    phone?: string;
  } | null;
  order_items: {
    id: string;
    price_at_time: number;
    start_date: string;
    end_date: string;
    inventory: {
      id: string;
      name: string;
      serial_number: string;
    } | null;
  }[];
}
// Обновленная версия loadAllOrders с учетом цены на момент аренды и логикой названия
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
//       client:clients(last_name, first_name, phone),
//       order_items(
//         id,
//         price_at_time,
//         start_date,
//         end_date,
//         inventory(id, name, serial_number)
//       )
//     `,
//     )
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.error("Error loading orders:", error);
//     throw error;
//   }

//   return (data || []).map((order: any) => {
//     const tools =
//       order.order_items
//         ?.map((item: any) => ({
//           ...item.inventory,
//           order_item_id: item.id,
//           price_at_time: item.price_at_time,
//           end_date: item.end_date,
//         }))
//         .filter((t: any) => t.id) || [];

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
//       client: order.client || { last_name: "Не указан", first_name: "" },
//       inventory: { name: mainInventoryName },
//       tools: tools,
//     };
//   });
// };

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
      client:clients(last_name, first_name, middle_name, phone),
      order_items(
        id,
        price_at_time, 
        start_date,
        end_date,
        inventory(id, name, serial_number)
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading orders:", error);
    throw error;
  }

  // Приведение типа к нашему интерфейсу массива
  const rawData = data as unknown as SupabaseAllOrdersRow[];

  return rawData.map((order) => {
    // Безопасно формируем список инструментов
    const tools = (order.order_items || [])
      .filter((item) => item.inventory) // Убираем пустые записи
      .map((item) => ({
        id: item.inventory!.id,
        name: item.inventory!.name,
        serial_number: item.inventory!.serial_number,
        price_at_time: item.price_at_time,
        start_date: item.start_date,
        end_date: item.end_date,
      }));

    // Логика формирования названия для списка
    let mainInventoryName = "Не указан";
    if (tools.length === 1) {
      mainInventoryName = tools[0].name;
    } else if (tools.length > 1) {
      mainInventoryName = `${tools[0].name} +${tools.length - 1}`;
    }

    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total_price: order.total_price,
      start_date: order.start_date,
      end_date: order.end_date,
      // Гарантируем обязательные поля клиента (включая middle_name)
      client: order.client || {
        last_name: "Не указан",
        first_name: "",
        middle_name: undefined,
      },
      inventory: { name: mainInventoryName },
      tools: tools,
    };
  });
};

// Обновление статуса заказа через RPC
export const updateOrderStatus = async (
  orderId: string,
  newStatus: string,
  finalPrice?: number,
) => {
  // Теперь передаем ВСЕ три параметра, которые ожидает наша новая SQL функция
  const { error } = await supabase.rpc("update_order_status_v2", {
    p_order_id: orderId,
    p_new_status: newStatus,
    p_total_price: finalPrice, // Вот здесь магия: передаем цену в базу
  });

  if (error) {
    console.error("Ошибка при обновлении статуса заказа через RPC:", error);
    throw error;
  }
};

// Удаление заказа по ID
export const deleteOrderById = async (id: string) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};
