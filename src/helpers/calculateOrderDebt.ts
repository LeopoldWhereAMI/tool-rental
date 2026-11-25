import { OrderDetailsUI } from "@/types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function calculateOrderDebt(order: OrderDetailsUI): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return order.order_items.reduce((totalDebt, item) => {
    // Возвращённый инструмент больше не может иметь текущую просрочку
    if (item.item_status === "returned") {
      return totalDebt;
    }

    const extensionDays = order.extensions
      .filter((extension) => extension.order_item_id === item.id)
      .reduce((sum, extension) => sum + extension.days, 0);

    const endDate = new Date(item.end_date);
    endDate.setDate(endDate.getDate() + extensionDays);
    endDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - endDate.getTime();

    if (diffTime <= 0) {
      return totalDebt;
    }

    const overdueDays = Math.ceil(diffTime / MS_PER_DAY);
    const itemDebt = overdueDays * item.price_at_time;

    return totalDebt + itemDebt;
  }, 0);
}
