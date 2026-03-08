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

  const parts = formatted.split(" ");
  const day = parts[0];
  const month = parts[1].replace(".", "").substring(0, 3);

  return `${day} ${month}`;
};

export function useOrderStatusInfo(order: OrderUI | OrderDetailsUI | null) {
  const result = useMemo(() => {
    if (!order) {
      return {
        actualEndDate: "",
        actualStartDate: "",
        returnStatus: { type: "pending", text: "" },
        isOverdue: false,
        isActive: false,
        isCompleted: false,
        hasValidDate: false,
        formattedStartDate: "—",
        formattedDate: "—",
        overdueDays: 0,
        debtAmount: 0,
        statusText: "",
        statusVariant: "",
      };
    }

    // 1. Извлекаем даты
    let start = order.start_date;
    let end = getActualEndDate(order as OrderUI);

    if (!start && order.tools?.length) {
      start = order.tools[0].start_date;
    }
    if (!end && order.tools?.length) {
      end = order.tools[0].end_date;
    }
    if (!end && "order_items" in order && order.order_items?.length) {
      const dates = order.order_items.map((item) =>
        new Date(item.end_date).getTime(),
      );
      end = new Date(Math.max(...dates)).toISOString();
    }

    // 2. Статус возврата
    const returnStatus = calculateReturnStatus(end || "", order.status || "");

    // 3. Расчет просрочки
    let overdueDays = 0;
    let debtAmount = 0;

    if (end && returnStatus.type === "overdue") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(end);
      endDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - endDate.getTime();
      overdueDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      let dailyRate = 0;
      if ("order_items" in order && order.order_items) {
        dailyRate = order.order_items.reduce(
          (sum, item) => sum + (item.inventory?.daily_price || 0),
          0,
        );
      } else if ("inventory" in order && order.inventory) {
        dailyRate = order.inventory.daily_price || 0;
      } else if (order.tools?.length) {
        dailyRate = order.tools.reduce(
          (sum, t) => sum + (t.price_at_time || 0),
          0,
        );
      }

      debtAmount = overdueDays * dailyRate;
    }

    // 4. Status display
    const isOverdue = returnStatus.type === "overdue";
    const isToday = returnStatus.text === "Сегодня возврат";
    let statusVariant = "";
    let statusText = "";

    if (order.status === "cancelled") {
      statusVariant = "badgeCancelled";
      statusText = "Отменён";
    } else if (order.status === "completed") {
      statusVariant = "badgeCompleted";
      statusText = "Завершён";
    } else if (isOverdue) {
      statusVariant = "badgeOverdue";
      statusText = returnStatus.text || "Просрочено";
    } else if (isToday) {
      statusVariant = "badgeToday";
      statusText = "Сегодня возврат";
    } else if (returnStatus.text) {
      statusVariant = "badgePending";
      statusText = returnStatus.text;
    }

    return {
      actualEndDate: end || "",
      actualStartDate: start || "",
      returnStatus,
      isOverdue,
      isActive: order.status === "active",
      isCompleted: order.status === "completed",
      hasValidDate: Boolean(end),
      formattedStartDate: formatSafeDate(start),
      formattedDate: formatSafeDate(end),
      overdueDays,
      debtAmount,
      statusText,
      statusVariant,
    };
  }, [order]);

  return result;
}
