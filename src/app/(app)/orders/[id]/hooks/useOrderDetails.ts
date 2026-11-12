"use client";

import { useCallback, useEffect, useState } from "react";
import { getOrderById } from "@/services/orderService";
import { getTransactions } from "@/services/financeService";
import { OrderDetailsUI } from "@/types";

export function useOrderDetails(id: string | string[] | undefined) {
  const [order, setOrder] = useState<OrderDetailsUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [additionalPayments, setAdditionalPayments] = useState(0);

  const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      const orderId = id as string;

      const [data, { transactions }] = await Promise.all([
        getOrderById(orderId),
        getTransactions(1, 100, undefined, orderId),
      ]);

      const payments = transactions
        .filter(
          (transaction) =>
            transaction.category === "OrderPayment" &&
            transaction.status === "completed",
        )
        .reduce(
          (sum, transaction) =>
            sum +
            (transaction.type === "income"
              ? transaction.amount
              : -transaction.amount),
          0,
        );

      setOrder(data);
      setAdditionalPayments(payments);
    } catch (err) {
      console.error("Ошибка загрузки заказа:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  return {
    order,
    loading,
    additionalPayments,
    loadOrder,
  };
}
