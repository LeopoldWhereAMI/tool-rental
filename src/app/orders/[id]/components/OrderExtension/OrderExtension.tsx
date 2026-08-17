"use client";

import { OrderDetailsUI } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import styles from "./OrderExtension.module.css";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import { payOrderExtensions } from "@/services/orderExtensionService";
import { getInstrumentWord } from "./helper";

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

  const [selectedOrderItemIds, setSelectedOrderItemIds] = useState<string[]>(
    [],
  );

  const [isCreating, setIsCreating] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const [createdExtensions, setCreatedExtensions] = useState<
    OrderDetailsUI["extensions"]
  >([]);

  const availableItems = order.order_items.filter((item) => !item.is_custom);

  const selectedItems = availableItems.filter((item) =>
    selectedOrderItemIds.includes(item.id),
  );

  const extensionAmount = selectedItems.reduce(
    (sum, item) => sum + item.price_at_time * days,
    0,
  );

  const allSelected =
    availableItems.length > 0 &&
    selectedOrderItemIds.length === availableItems.length;

  const handleOpen = () => {
    setIsClosing(false);

    // По умолчанию продлеваем весь заказ
    setSelectedOrderItemIds(availableItems.map((item) => item.id));

    setDays(1);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleToggleItem = (itemId: string) => {
    setSelectedOrderItemIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  };

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedOrderItemIds([]);
      return;
    }

    setSelectedOrderItemIds(availableItems.map((item) => item.id));
  };

  const handleCreateExtension = async () => {
    if (isCreating) return;

    if (selectedOrderItemIds.length === 0) {
      toast.error("Выберите хотя бы один инструмент");
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch(`/api/orders/${order.id}/extensions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          days,
          orderItemIds: selectedOrderItemIds,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      const extensions = result.data.extensions;

      const extensionsUI: OrderDetailsUI["extensions"] = extensions.map(
        (extension: {
          id: string;
          days: number;
          amount: number | string;
          paidAmount: number | string;
          createdAt: string;
          orderItemId: string;
        }) => ({
          id: extension.id,
          days: extension.days,
          amount: Number(extension.amount),
          paid_amount: Number(extension.paidAmount),
          created_at: extension.createdAt,
          order_item_id: extension.orderItemId,
        }),
      );

      handleClose();

      setTimeout(() => {
        setCreatedExtensions(extensionsUI);
      }, 200);
    } catch (error) {
      console.error("Ошибка продления:", error);

      toast.error(
        error instanceof Error ? error.message : "Не удалось продлить аренду",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const createdExtensionsAmount = createdExtensions.reduce(
    (sum, extension) => sum + extension.amount,
    0,
  );

  const handlePayNow = async () => {
    if (createdExtensions.length === 0 || isPaying) return;

    setIsPaying(true);

    try {
      for (const extension of createdExtensions) {
        await payOrderExtensions({
          orderId: order.id,
          extensionId: extension.id,
          amount: extension.amount,
          orderNumber: order.order_number,
        });
      }

      toast.success(`Продление оплачено: ${createdExtensionsAmount} ₽`);

      for (const extension of createdExtensions) {
        onExtensionCreated?.({
          ...extension,
          paid_amount: extension.amount,
        });
      }

      setCreatedExtensions([]);
    } catch (error) {
      console.error("Ошибка оплаты продлений:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Не удалось оплатить продления",
      );
    } finally {
      setIsPaying(false);
    }
  };

  const handlePayLater = () => {
    for (const extension of createdExtensions) {
      onExtensionCreated?.(extension);
    }

    setCreatedExtensions([]);
  };

  const isExtensionDisabled = isCompleted || isOverdue;

  return (
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
              <div className={styles.itemsHeader}>
                <span className={styles.label}>Инструменты для продления</span>

                <span className={styles.itemsCount}>
                  {selectedOrderItemIds.length} из {availableItems.length}
                </span>
              </div>

              <div className={styles.items}>
                <button
                  type="button"
                  className={`${styles.itemButton} ${styles.selectAllButton} ${
                    allSelected ? styles.itemButtonActive : ""
                  }`}
                  onClick={handleToggleAll}
                >
                  <span
                    className={`${styles.checkbox} ${
                      allSelected ? styles.checkboxActive : ""
                    }`}
                  >
                    {allSelected && "✓"}
                  </span>

                  <span className={styles.itemName}>
                    {allSelected
                      ? "Все инструменты выбраны"
                      : "Выбрать все инструменты"}
                  </span>
                </button>
                {availableItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.itemButton} ${
                      selectedOrderItemIds.includes(item.id)
                        ? styles.itemButtonActive
                        : ""
                    }`}
                    onClick={() => handleToggleItem(item.id)}
                  >
                    <span
                      className={`${styles.checkbox} ${
                        selectedOrderItemIds.includes(item.id)
                          ? styles.checkboxActive
                          : ""
                      }`}
                    >
                      {selectedOrderItemIds.includes(item.id) && "✓"}
                    </span>

                    <span className={styles.itemName}>
                      {item.inventory?.name ?? "Инструмент"}
                    </span>

                    <span className={styles.itemPrice}>
                      {item.price_at_time} ₽ / день
                    </span>
                  </button>
                ))}
              </div>
              {selectedItems.length > 0 && (
                <div className={styles.selectionSummary}>
                  <span>
                    Выбрано:{" "}
                    <strong>
                      {selectedItems.length}{" "}
                      {getInstrumentWord(selectedItems.length)}
                    </strong>
                  </span>

                  <span>
                    <strong>
                      {selectedItems.reduce(
                        (sum, item) => sum + item.price_at_time,
                        0,
                      )}{" "}
                      ₽
                    </strong>{" "}
                    / день
                  </span>
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Количество дней</label>

              <input
                className={styles.input}
                type="number"
                min={1}
                value={days}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setDays(Number.isFinite(value) ? Math.max(1, value) : 1);
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
                disabled={isCreating}
              >
                Отмена
              </button>

              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleCreateExtension}
                disabled={isCreating || selectedOrderItemIds.length === 0}
              >
                {isCreating
                  ? "Создание..."
                  : selectedOrderItemIds.length === 0
                    ? "Выберите инструмент"
                    : `Продлить на ${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"} · ${extensionAmount.toLocaleString("ru-RU")} ₽`}
              </button>
            </div>
          </div>
        </div>
      )}

      {createdExtensions.length > 0 && (
        <div className={styles.created}>
          <h3 className={styles.createdTitle}>Продление создано</h3>

          <p className={styles.createdText}>
            Позиций: <strong>{createdExtensions.length}</strong>
          </p>

          <p className={styles.createdText}>
            Сумма продления: <strong>{createdExtensionsAmount} ₽</strong>
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
              onClick={handlePayLater}
              disabled={isPaying}
            >
              Оплатить позже
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
