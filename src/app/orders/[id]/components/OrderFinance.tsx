"use client";

import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Banknote,
} from "lucide-react";
import styles from "../page.module.css";
import { OrderDetailsUI } from "@/types";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import { useEffect, useState } from "react";
import CompleteOrderModal from "@/components/ui/MyModal/CompliteOrderModal";
import { updateOrderStatus } from "@/services/orderService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { processOrderMaintenance } from "@/services/inventoryService";
import { onOrderCompleted } from "@/helpers/financeIntegration";

type OrderFinanceProps = {
  totalPrice: number;
  order: OrderDetailsUI;
  onFinalAmountChange?: (amount: number) => void;
};

export default function OrderFinance({
  totalPrice,
  order,
  onFinalAmountChange,
}: OrderFinanceProps) {
  const { debtAmount, overdueDays } = useOrderStatusInfo(order);
  const [adjustment, setAdjustment] = useState<number | string>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const router = useRouter();

  const parsedAdjustment = Number(adjustment);
  const safeAdjustment = isNaN(parsedAdjustment) ? 0 : parsedAdjustment;

  // ТЕПЕРЬ: К оплате только долг и корректировки (основная сумма уже оплачена при создании)
  const additionalPayment = debtAmount + safeAdjustment;

  // Для отображения в модалке итоговой суммы договора (информативно)
  const fullContractAmount = totalPrice + debtAmount + safeAdjustment;

  const isRefund = additionalPayment < 0;
  const absAmount = Math.abs(additionalPayment);

  useEffect(() => {
    onFinalAmountChange?.(fullContractAmount);
  }, [fullContractAmount, onFinalAmountChange]);

  const handleCompleteRequest = () => {
    if (currentStatus === "completed") return;
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Обновляем статус заказа
      await updateOrderStatus(order.id, "completed", fullContractAmount);

      // 2. Если есть ДОПЛАТА (просрочка/штраф), записываем её в финансы
      if (additionalPayment !== 0) {
        const desc = `Доплата по заказу #${order.order_number}${debtAmount > 0 ? " (просрочка)" : ""}`;
        await onOrderCompleted(order.id, additionalPayment, desc);
      }

      // 3. Обслуживание (пробег/моточасы)
      await processOrderMaintenance(order);

      toast.success(
        isRefund
          ? `Возврат ${absAmount} ₽ оформлен. Заказ закрыт.`
          : `Доплата ${additionalPayment} ₽ принята. Заказ закрыт.`,
      );

      setCurrentStatus("completed");
      setIsModalOpen(false);

      setTimeout(() => {
        router.push("/orders");
        router.refresh();
      }, 800);
    } catch (err) {
      toast.error("Ошибка при завершении заказа");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.infoBlock} ${styles.totalBlock}`}>
      <div className={styles.blockTitle}>
        <CreditCard size={20} /> <h3>Закрытие заказа</h3>
      </div>
      <div className={`${styles.blockContent} ${styles.financeBlockContent}`}>
        {/* Статус основной оплаты */}
        <div className={styles.prepaidBadge}>
          <CheckCircle size={14} />
          <span>Основная аренда оплачена</span>
        </div>

        <div className={styles.paymentSummary}>
          <p className={styles.totalLabel}>
            {additionalPayment < 0
              ? "Сумма к возврату"
              : "Доплата при возврате"}
          </p>
          <p
            className={`${styles.price} ${additionalPayment > 0 ? styles.hasDebt : ""}`}
          >
            {additionalPayment} ₽
          </p>
        </div>

        {debtAmount > 0 && (
          <div className={styles.debtDetails}>
            <div className={styles.debtHeader}>
              <AlertCircle size={14} />
              <span>Просрочка: {overdueDays} дн.</span>
            </div>
            <p className={styles.debtText}>
              Нужно доплатить: <strong>{debtAmount} ₽</strong>
            </p>
          </div>
        )}

        {order.security_deposit ? (
          <div
            className={`${styles.depositInfo} ${currentStatus !== "completed" ? styles.highlightDeposit : ""}`}
          >
            <div className={styles.depositInfoLeft}>
              <ShieldCheck size={14} />
              <span>Вернуть залог клиенту</span>
            </div>
            <span className={styles.depositInfoAmount}>
              {order.security_deposit} ₽
            </span>
          </div>
        ) : null}

        {currentStatus !== "completed" && (
          <>
            <div className={styles.adjustmentBlock}>
              <label className={styles.adjLabel}>
                <span>Штраф (+) / Скидка (-)</span>
                <input
                  type="number"
                  value={adjustment}
                  onChange={(e) => setAdjustment(e.target.value)}
                  placeholder="0"
                  className={styles.adjInput}
                />
              </label>
            </div>
            <button
              className={styles.completeOrderBtn}
              onClick={handleCompleteRequest}
              disabled={isSubmitting}
            >
              <Banknote size={18} />
              {additionalPayment > 0
                ? "Принять доплату и закрыть"
                : "Закрыть заказ"}
            </button>
          </>
        )}
      </div>

      <CompleteOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        finalAmount={additionalPayment} // Показываем в модалке только то, что берем СЕЙЧАС
        onConfirm={handleConfirm}
        loading={isSubmitting}
      />
    </div>
  );
}
