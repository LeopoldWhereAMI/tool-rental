"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createTransaction } from "@/services/financeService";
import styles from "./AddPaymentForm.module.css";

type AddPaymentFormProps = {
  orderId: string;
  orderNumber: string;

  onPaymentAdded: () => void;
};

export default function AddPaymentForm({
  orderId,
  orderNumber,

  onPaymentAdded,
}: AddPaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      toast.error("Введите корректную сумму");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createTransaction({
        type: "income",
        amount: paymentAmount,
        description:
          comment.trim() || `Дополнительный платёж по заказу #${orderNumber}`,
        category: "OrderPayment",
        status: "completed",
        order_id: orderId,
      });

      toast.success(`Платёж ${paymentAmount} ₽ добавлен`);

      setAmount("");
      setComment("");

      onPaymentAdded();
    } catch (error) {
      console.error("Ошибка добавления платежа:", error);
      toast.error("Не удалось добавить платёж");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Сумма</label>

        <input
          className={styles.input}
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Комментарий</label>

        <input
          className={styles.input}
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Например: доплата за аренду"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          disabled={isSubmitting}
          onClick={() => {
            setAmount("");
            setComment("");
            onPaymentAdded();
          }}
        >
          Отмена
        </button>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Добавление..." : "Добавить платёж"}
        </button>
      </div>
    </form>
  );
}
