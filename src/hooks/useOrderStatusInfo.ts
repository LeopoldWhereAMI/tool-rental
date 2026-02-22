// import { useMemo } from "react";
// import { OrderUI, OrderDetailsUI } from "@/types";
// import { getActualEndDate, calculateReturnStatus } from "@/helpers";

// export function useOrderStatusInfo(order: OrderUI | OrderDetailsUI | null) {
//   const actualEndDate = useMemo(() => {
//     if (!order) return "";

//     let date = getActualEndDate(order as OrderUI);

//     if (!date && "order_items" in order && order.order_items?.length > 0) {
//       const dates = order.order_items.map((item) =>
//         new Date(item.end_date).getTime(),
//       );
//       date = new Date(Math.max(...dates)).toISOString();
//     }

//     return date || "";
//   }, [order]);

//   const returnStatus = useMemo(
//     () => calculateReturnStatus(actualEndDate, order?.status || ""),
//     [actualEndDate, order?.status],
//   );

//   const debtData = useMemo(() => {
//     if (!order || !actualEndDate || returnStatus.type !== "overdue") {
//       return { overdueDays: 0, debtAmount: 0 };
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const end = new Date(actualEndDate);
//     end.setHours(0, 0, 0, 0);

//     const diffTime = today.getTime() - end.getTime();
//     const overdueDays = Math.max(
//       0,
//       Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
//     );

//     let dailyRate = 0;
//     if ("order_items" in order && order.order_items) {
//       dailyRate = order.order_items.reduce(
//         (sum, item) => sum + (item.inventory?.daily_price || 0),
//         0,
//       );
//     } else if ("inventory" in order && order.inventory) {
//       dailyRate = order.inventory.daily_price || 0;
//     }

//     return {
//       overdueDays,
//       debtAmount: overdueDays * dailyRate,
//     };
//   }, [order, actualEndDate, returnStatus.type]);

//   const isActive = order?.status === "active";
//   const isCompleted = order?.status === "completed";
//   const hasValidDate = Boolean(actualEndDate && actualEndDate !== "");

//   return {
//     actualEndDate,
//     returnStatus,
//     isOverdue: returnStatus.type === "overdue",
//     isActive,
//     isCompleted,
//     hasValidDate,
//     formattedDate: hasValidDate
//       ? new Date(actualEndDate).toLocaleDateString()
//       : "—",
//     overdueDays: debtData.overdueDays,
//     debtAmount: debtData.debtAmount,
//   };
// }

import { useMemo } from "react";
import { OrderUI, OrderDetailsUI } from "@/types";
import { getActualEndDate, calculateReturnStatus } from "@/helpers";

// Вспомогательная функция для безопасного форматирования
const formatSafeDate = (dateStr: string | undefined | null) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";

  const formatted = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });

  // Убираем точку в конце (февр. -> февр) и, если нужно,
  // ограничиваем до 3 символов (февр -> фев)
  const parts = formatted.split(" ");
  const day = parts[0];
  const month = parts[1].replace(".", "").substring(0, 3);

  return `${day} ${month}`;
};

export function useOrderStatusInfo(order: OrderUI | OrderDetailsUI | null) {
  // 1. Извлекаем "сырые" даты с учетом вложенности в tools
  const rawDates = useMemo(() => {
    if (!order) return { start: null, end: null };

    // Пробуем взять даты из корня
    let start = order.start_date;
    let end = getActualEndDate(order as OrderUI);

    // Логика из вашего лога: если в корне null, берем из первого инструмента
    if (!start && order.tools && order.tools.length > 0) {
      start = order.tools[0].start_date;
    }

    if (!end && order.tools && order.tools.length > 0) {
      end = order.tools[0].end_date;
    }

    // Дополнительная проверка для order_items (если структура OrderDetailsUI)
    if (
      !end &&
      "order_items" in order &&
      (order.order_items?.length ?? 0) > 0
    ) {
      const dates = order.order_items!.map((item) =>
        new Date(item.end_date).getTime(),
      );
      end = new Date(Math.max(...dates)).toISOString();
    }

    return { start, end };
  }, [order]);

  const actualEndDate = rawDates.end || "";
  const actualStartDate = rawDates.start || "";

  // 2. Статус возврата (используем найденную дату)
  const returnStatus = useMemo(
    () => calculateReturnStatus(actualEndDate, order?.status || ""),
    [actualEndDate, order?.status],
  );

  // 3. Расчет просрочки и долга
  const debtData = useMemo(() => {
    if (!order || !actualEndDate || returnStatus.type !== "overdue") {
      return { overdueDays: 0, debtAmount: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(actualEndDate);
    end.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - end.getTime();
    const overdueDays = Math.max(
      0,
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
    );

    let dailyRate = 0;
    if ("order_items" in order && order.order_items) {
      dailyRate = order.order_items.reduce(
        (sum, item) => sum + (item.inventory?.daily_price || 0),
        0,
      );
    } else if ("inventory" in order && order.inventory) {
      dailyRate = order.inventory.daily_price || 0;
    } else if (order.tools && order.tools.length > 0) {
      // Запасной вариант для вашей структуры tools
      dailyRate = order.tools.reduce(
        (sum, t) => sum + (t.price_at_time || 0),
        0,
      );
    }

    return { overdueDays, debtAmount: overdueDays * dailyRate };
  }, [order, actualEndDate, returnStatus.type]);

  const isActive = order?.status === "active";
  const isCompleted = order?.status === "completed";
  const hasValidDate = Boolean(actualEndDate && actualEndDate !== "");

  return {
    actualEndDate,
    returnStatus,
    isOverdue: returnStatus.type === "overdue",
    isActive,
    isCompleted,
    hasValidDate,
    // Форматированные строки для UI
    formattedStartDate: formatSafeDate(actualStartDate),
    formattedDate: formatSafeDate(actualEndDate),
    overdueDays: debtData.overdueDays,
    debtAmount: debtData.debtAmount,
  };
}
