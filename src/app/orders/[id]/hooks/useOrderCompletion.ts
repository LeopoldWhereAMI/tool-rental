"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/services/orderService";
import { onOrderCompleted } from "@/helpers/financeIntegration";
import { processOrderMaintenance } from "@/services/inventoryService";
import { toast } from "sonner";
import { OrderDetailsUI } from "@/types";

type FinanceData = {
  finalAmount: number;
  additionalPayment: number;
  debtAmount: number;
};

type UseOrderCompletionParams = {
  order: OrderDetailsUI | null;
  financeData: FinanceData;
  onCompleted: () => Promise<void>;
};

export function useOrderCompletion({
  order,
  financeData,
  onCompleted,
}: UseOrderCompletionParams) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeOrder = async () => {
    if (isSubmitting || !order) return;

    setIsSubmitting(true);

    try {
      await updateOrderStatus(order.id, "completed", financeData.finalAmount);

      if (financeData.additionalPayment !== 0) {
        const desc = `Доплата по заказу #${order.order_number}${
          financeData.debtAmount > 0 ? " (просрочка)" : ""
        }`;

        await onOrderCompleted(order.id, financeData.additionalPayment, desc);
      }

      await processOrderMaintenance(order);

      const isRefund = financeData.additionalPayment < 0;
      const absAmount = Math.abs(financeData.additionalPayment);

      toast.success(
        isRefund
          ? `Возврат ${absAmount} ₽ оформлен. Заказ закрыт.`
          : `Доплата ${financeData.additionalPayment} ₽ принята. Заказ закрыт.`,
      );

      await onCompleted();
    } catch (err) {
      toast.error("Ошибка при завершении заказа");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    completeOrder,
    isSubmitting,
  };
}
