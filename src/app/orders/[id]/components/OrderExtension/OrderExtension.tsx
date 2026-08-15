"use client";

import { OrderDetailsUI } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import styles from "./OrderExtension.module.css";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";

type OrderExtensionProps = {
  order: OrderDetailsUI;
  onExtensionCreated?: (
    extension: OrderDetailsUI["extensions"][number],
  ) => void;
  onExtensionUpdated?: (
    extension: OrderDetailsUI["extensions"][number],
  ) => void;
};

export default function OrderExtension({
  order,
  onExtensionCreated,
}: OrderExtensionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { isCompleted, isOverdue } = useOrderStatusInfo(order);
  const [days, setDays] = useState(1);
  const [isPaying, setIsPaying] = useState(false);
  const [createdExtension, setCreatedExtension] = useState<
    OrderDetailsUI["extensions"][number] | null
  >(null);

  const handleOpen = () => {
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const dailyAmount = order.order_items.reduce((sum, item) => {
    if (item.is_custom) return sum;

    return sum + item.price_at_time;
  }, 0);

  const extensionAmount = dailyAmount * days;

  const handleCreateExtension = async () => {
    try {
      const response = await fetch(`/api/orders/${order.id}/extensions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          days,
          amount: extensionAmount,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      const extension = result.data.extension;

      const extensionUI = {
        id: extension.id,
        days: extension.days,
        amount: Number(extension.amount),
        paid_amount: Number(extension.paidAmount),
        created_at: extension.createdAt,
      };

      handleClose();

      setTimeout(() => {
        setCreatedExtension(extensionUI);
      }, 200);
    } catch (error) {
      console.error("Ошибка продления:", error);
      toast.error(
        error instanceof Error ? error.message : "Не удалось продлить аренду",
      );
    }
  };

  const handlePayNow = async () => {
    if (!createdExtension || isPaying) return;

    setIsPaying(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "income",
          amount: createdExtension.amount,
          description: `Оплата продления по заказу #${order.order_number}`,
          category: "OrderExtension",
          status: "completed",
          order_id: order.id,
          extension_id: createdExtension.id,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(`Продление оплачено: ${createdExtension.amount} ₽`);

      onExtensionCreated?.({
        ...createdExtension,
        paid_amount: createdExtension.amount,
      });

      setCreatedExtension(null);
    } catch (error) {
      console.error("Ошибка оплаты продления:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Не удалось оплатить продление",
      );
    } finally {
      setIsPaying(false);
    }
  };

  const isExtensionDisabled = isCompleted || isOverdue;

  return (
    <>
      <div className={styles.extension}>
        <button
          type="button"
          className={styles.openButton}
          onClick={handleOpen}
          disabled={isExtensionDisabled}
          title={
            isCompleted
              ? "Нельзя продлить завершённый заказ"
              : isOverdue
                ? "Нельзя продлить просроченный заказ"
                : undefined
          }
        >
          {isCompleted
            ? "Заказ завершён"
            : isOverdue
              ? "Заказ просрочен"
              : "Продлить аренду"}
        </button>

        {isOpen && (
          <div
            className={`${styles.overlay} ${
              isClosing ? styles.overlayClosing : ""
            }`}
          >
            <div
              className={`${styles.modal} ${
                isClosing ? styles.modalClosing : ""
              }`}
            >
              <h3 className={styles.title}>Продление аренды</h3>

              <div className={styles.field}>
                <label className={styles.label}>Количество дней</label>

                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  value={days}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setDays(Math.max(1, value));
                  }}
                />
              </div>

              <div className={styles.amount}>
                <span className={styles.amountLabel}>Стоимость продления</span>

                <strong className={styles.amountValue}>
                  {extensionAmount} ₽
                </strong>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleClose}
                >
                  Отмена
                </button>

                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleCreateExtension}
                >
                  Принять продление
                </button>
              </div>
            </div>
          </div>
        )}
        {createdExtension && (
          <div className={styles.created}>
            <h3 className={styles.createdTitle}>Продление создано</h3>

            <p className={styles.createdText}>
              Сумма продления: <strong>{createdExtension.amount} ₽</strong>
            </p>

            <div className={styles.createdActions}>
              <button
                type="button"
                className={styles.payButton}
                onClick={handlePayNow}
                disabled={isPaying}
              >
                {isPaying ? "Оплата..." : "Оплатить сейчас"}
              </button>

              <button
                type="button"
                className={styles.laterButton}
                onClick={() => {
                  if (!createdExtension) return;

                  onExtensionCreated?.(createdExtension);
                  setCreatedExtension(null);
                }}
              >
                Оплатить позже
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
