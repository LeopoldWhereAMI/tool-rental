"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  getTransactions,
  Transaction,
  updateTransactionStatus,
} from "@/services/financeService";
import styles from "./OrderPayment.module.css";

type OrderPaymentsProps = {
  orderId: string;
};

export default function OrderPayments({ orderId }: OrderPaymentsProps) {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  const loadPayments = useCallback(async () => {
    try {
      setPaymentsLoading(true);

      const result = await getTransactions(1, 100, "income", orderId);

      setPayments(result.transactions);
    } catch (error) {
      console.error("Ошибка загрузки платежей:", error);
    } finally {
      setPaymentsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleCancelPayment = (paymentId: string) => {
    toast("Отменить этот платёж?", {
      description: "Платёж будет помечен как отменённый.",
      action: {
        label: "Отменить",
        onClick: async () => {
          try {
            await updateTransactionStatus(paymentId, "cancelled");

            toast.success("Платёж отменён");

            await loadPayments();
          } catch (error) {
            console.error("Ошибка отмены платежа:", error);
            toast.error("Не удалось отменить платёж");
          }
        },
      },
    });
  };

  if (paymentsLoading) {
    return null;
  }

  if (payments.length === 0) {
    return null;
  }

  return (
    <div className={styles.paymentsBlock}>
      <div className={styles.paymentsHeader}>
        <span>Платежи</span>
      </div>

      <div className={styles.paymentsList}>
        {payments.map((payment) => (
          <div
            key={payment.id}
            className={`${styles.paymentItem} ${
              payment.status === "cancelled" ? styles.cancelledPayment : ""
            }`}
          >
            <div className={styles.paymentContent}>
              <strong>+ {payment.amount} ₽</strong>

              <span>{payment.description}</span>
            </div>

            <div className={styles.paymentMeta}>
              <small>
                {new Date(payment.created_at).toLocaleString("ru-RU")}
              </small>

              {payment.status === "completed" && (
                <button
                  type="button"
                  className={styles.cancelPaymentButton}
                  onClick={() => handleCancelPayment(payment.id)}
                  title="Отменить платёж"
                  aria-label="Отменить платёж"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {payment.status === "cancelled" && (
              <span className={styles.cancelledLabel}>Отменён</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
