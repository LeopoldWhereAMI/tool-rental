import { useMemo } from "react";
import { OrderUI, OrderDetailsUI } from "@/types";
import { getActualEndDate, calculateReturnStatus } from "@/helpers";

export function useOrderStatusInfo(order: OrderUI | OrderDetailsUI | null) {
  const actualEndDate = useMemo(() => {
    if (!order) return "";

    let date = getActualEndDate(order as OrderUI);

    if (!date && "order_items" in order && order.order_items?.length > 0) {
      const dates = order.order_items.map((item) =>
        new Date(item.end_date).getTime(),
      );
      date = new Date(Math.max(...dates)).toISOString();
    }

    return date || "";
  }, [order]);

  const returnStatus = useMemo(
    () => calculateReturnStatus(actualEndDate, order?.status || ""),
    [actualEndDate, order?.status],
  );

  // 3. Рассчитываем просрочку и долг
  const debtData = useMemo(() => {
    // Важно: проверяем order на null здесь
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

    // Безопасный расчет суточной ставки
    let dailyRate = 0;
    if ("order_items" in order && order.order_items) {
      dailyRate = order.order_items.reduce(
        (sum, item) => sum + (item.inventory?.daily_price || 0),
        0,
      );
    } else if ("inventory" in order && order.inventory) {
      dailyRate = order.inventory.daily_price || 0;
    }

    return {
      overdueDays,
      debtAmount: overdueDays * dailyRate,
    };
  }, [order, actualEndDate, returnStatus.type]); // Date.now() убран из зависимостей

  const isActive = order?.status === "active";
  const hasValidDate = Boolean(actualEndDate && actualEndDate !== "");

  return {
    actualEndDate,
    returnStatus,
    isOverdue: returnStatus.type === "overdue",
    isActive,
    hasValidDate,
    formattedDate: hasValidDate
      ? new Date(actualEndDate).toLocaleDateString()
      : "—",
    overdueDays: debtData.overdueDays,
    debtAmount: debtData.debtAmount,
  };
}
