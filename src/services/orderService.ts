import { supabase } from "@/lib/supabase";
import { CreateOrderDTO, OrderUI } from "@/types";

export const createOrder = async (orderData: CreateOrderDTO) => {
  try {
    // 1. Создаем запись в таблице заказов
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          inventory_id: orderData.inventory_id,
          client_id: orderData.client_id,
          start_date: orderData.start_date,
          end_date: orderData.end_date,
          total_price: orderData.total_price,
          status: "active", // Начальный статус заказа
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Обновляем статус инструмента в инвентаре на 'rented'
    const { error: inventoryError } = await supabase
      .from("inventory")
      .update({ status: "rented" })
      .eq("id", orderData.inventory_id);

    if (inventoryError) throw inventoryError;

    return order;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Ошибка при создании заказа";
    console.error("Order Service Error:", message);
    throw new Error(message);
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
  // Если даты совпадают (взял и вернул в один день), ставим 1 день.
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 4. Бизнес-логика:
  // - Если дата окончания меньше даты начала, возвращаем 0 (или можно кинуть ошибку)
  // - Если даты совпадают, берем оплату за 1 полные сутки
  if (diffDays < 0) return 0;
  if (diffDays === 0) diffDays = 1;

  return diffDays * dailyPrice;
};

// Получаем заказ по id
export const getOrderById = async (id: string) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      client:clients(*),
      inventory:inventory(*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// Получение всех заказов
// export const loadAllOrders = async () => {
//   const { data, error } = await supabase
//     .from("orders")
//     .select(
//       `
//       id,
//       total_price,
//       start_date,
//       end_date,
//       client:clients(last_name, first_name),
//       inventory:inventory(name),
//       order_number,
//       status
//     `,
//     )
//     .order("created_at", { ascending: false }); // Сначала новые

//   if (error) throw error;
//   return data;
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
      client:clients(last_name, first_name, phone),
      inventory:inventory(name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((order: any) => ({
    id: order.id,
    order_number: order.order_number,
    status: order.status,
    total_price: order.total_price,
    start_date: order.start_date,
    end_date: order.end_date,
    // Так как в консоли мы видим объекты, убираем [0]
    client: order.client || { last_name: "Не указан", first_name: "" },
    inventory: order.inventory || { name: "Удален" },
  }));
};
/**
 * Обновляет статус заказа (active, completed, cancelled)
 */
export const updateOrderStatus = async (
  orderId: string,
  newStatus: "active" | "completed" | "cancelled",
) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .select() // Возвращаем обновленные данные, если нужно
    .single();

  if (error) {
    console.error("Ошибка при обновлении статуса заказа:", error);
    throw new Error(error.message);
  }

  return data;
};

// Удаление заказа по id
export const deleteOrderById = async (id: string) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
};
