import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  ShieldCheck,
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
  const [adjustment, setAdjustment] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Создаем локальный статус для мгновенной реакции UI
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const router = useRouter();

  const finalAmount = totalPrice + debtAmount + adjustment;
  const securityDeposit = order.security_deposit;

  useEffect(() => {
    onFinalAmountChange?.(finalAmount);
  }, [finalAmount, onFinalAmountChange]);

  const handleCompleteRequest = () => {
    if (currentStatus === "completed") return;
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const description = order.inventory?.name
      ? `Заказ #${order.order_number}: ${order.inventory.name}`
      : `Заказ #${order.order_number}`;

    try {
      // Шаг 1: Финансы и статус заказа
      await updateOrderStatus(order.id, "completed", finalAmount);

      await onOrderCompleted(order.id, finalAmount, description);

      // Шаг 2: Техническое обслуживание (вызываем оркестратор)
      await processOrderMaintenance(order);

      toast.success("Заказ завершен. Пробег обновлен.");

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
        <CreditCard size={20} /> <h3>Оплата</h3>
      </div>
      <div className={`${styles.blockContent} ${styles.financeBlockContent}`}>
        <p className={styles.totalLabel}>Итого к оплате</p>
        <p className={styles.price}>{finalAmount} ₽</p>

        {debtAmount > 0 && (
          <div className={styles.debtDetails}>
            <div className={styles.debtHeader}>
              <AlertCircle size={14} />
              <span>Включена просрочка ({overdueDays} дн.)</span>
            </div>
            <div className={styles.debtBreakdown}>
              <span>По договору: {totalPrice} ₽</span>
              <span className={styles.debtPlus}>+ {debtAmount} ₽ долг</span>
            </div>
          </div>
        )}

        {securityDeposit ? (
          <div className={styles.depositInfo}>
            <div className={styles.depositInfoLeft}>
              <ShieldCheck size={14} />
              <span>Обеспечительный платёж</span>
            </div>
            <span className={styles.depositInfoAmount}>
              {securityDeposit} ₽
            </span>
          </div>
        ) : null}

        {currentStatus !== "completed" && (
          <>
            <div className={styles.adjustmentBlock}>
              <label className={styles.adjLabel}>
                <span>Скидка (-) / Наценка (+)</span>
                <input
                  value={adjustment || ""}
                  onChange={(e) => setAdjustment(Number(e.target.value))}
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
              <CheckCircle size={18} />
              Завершить и принять оплату
            </button>
          </>
        )}
      </div>
      <CompleteOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        finalAmount={finalAmount}
        onConfirm={handleConfirm}
        loading={isSubmitting}
      />
      {currentStatus === "completed" && (
        <div className={styles.completedStatus}>
          <CheckCircle size={16} color="#10b981" />
          <span>Оплачено и завершено</span>
        </div>
      )}
    </div>
  );
}
