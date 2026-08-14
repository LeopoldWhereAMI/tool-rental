"use client";

import { CheckCircle, CreditCard, Banknote, X } from "lucide-react";
import { OrderDetailsUI } from "@/types";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import { useCallback, useEffect, useState } from "react";
import CompleteOrderModal from "@/components/ui/MyModal/CompliteOrderModal";
import { updateOrderStatus } from "@/services/orderService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { processOrderMaintenance } from "@/services/inventoryService";
import { onOrderCompleted } from "@/helpers/financeIntegration";
import {
  getTransactions,
  Transaction,
  updateTransactionStatus,
} from "@/services/financeService";
import AddPaymentForm from "./AddPaymentForm/AddPaymentForm";
import OrderExtension from "./OrderExtension/OrderExtension";
import styles from "../page.module.css";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import usePagination from "@/hooks/usePagination";
import OrderExtensionsList from "./OrderExtension/OrderExtensionsList";

type OrderFinanceProps = {
  totalPrice: number;
  order: OrderDetailsUI;
  onFinanceUpdate?: (data: { finalAmount: number; adjustment: number }) => void;
};

export default function OrderFinance({
  totalPrice,
  order,
  onFinanceUpdate,
}: OrderFinanceProps) {
  const { debtAmount, overdueDays } = useOrderStatusInfo(order);
  const [adjustment, setAdjustment] = useState<number | string>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [extensions, setExtensions] = useState(order.extensions);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  const {
    currentPage,
    totalPages,
    currentItems: currentPayments,
    handlePageChange,
    pageLoading,
  } = usePagination({
    items: payments,
    itemsPerPage: 3,
  });

  const router = useRouter();

  const parsedAdjustment = Number(adjustment);
  const safeAdjustment = isNaN(parsedAdjustment) ? 0 : parsedAdjustment;
  const unpaidExtensions = extensions.reduce(
    (sum, extension) => sum + (extension.amount - extension.paid_amount),
    0,
  );

  const additionalPayment = debtAmount + unpaidExtensions + safeAdjustment;
  const fullContractAmount = totalPrice + debtAmount + safeAdjustment;

  const isRefund = additionalPayment < 0;
  const absAmount = Math.abs(additionalPayment);

  useEffect(() => {
    onFinanceUpdate?.({
      finalAmount: fullContractAmount,
      adjustment: safeAdjustment,
    });
  }, [fullContractAmount, safeAdjustment, onFinanceUpdate]);

  const handleCompleteRequest = () => {
    if (currentStatus === "completed") return;
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updateOrderStatus(order.id, "completed", fullContractAmount);

      if (additionalPayment !== 0) {
        const desc = `Доплата по заказу #${order.order_number}${debtAmount > 0 ? " (просрочка)" : ""}`;
        await onOrderCompleted(order.id, additionalPayment, desc);
      }

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

  const loadPayments = useCallback(async () => {
    try {
      setPaymentsLoading(true);

      const result = await getTransactions(1, 100, "income", order.id);

      setPayments(result.transactions);
    } catch (error) {
      console.error("Ошибка загрузки платежей:", error);
    } finally {
      setPaymentsLoading(false);
    }
  }, [order.id]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

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

        <OrderExtension
          order={order}
          onExtensionCreated={(extension) => {
            setExtensions((prev) => [...prev, extension]);
          }}
          onExtensionUpdated={(updatedExtension) => {
            setExtensions((prev) =>
              prev.map((extension) =>
                extension.id === updatedExtension.id
                  ? updatedExtension
                  : extension,
              ),
            );
          }}
        />

        <OrderExtensionsList
          extensions={extensions}
          orderId={order.id}
          orderNumber={order.order_number}
          onExtensionPaid={(extensionId, amount) => {
            setExtensions((prev) =>
              prev.map((extension) =>
                extension.id === extensionId
                  ? {
                      ...extension,
                      paid_amount: extension.paid_amount + amount,
                    }
                  : extension,
              ),
            );
          }}
        />

        <div className={styles.paymentsBlock}>
          <div className={styles.paymentsHeader}>
            <span>Платежи</span>

            {!isPaymentFormOpen && (
              <button type="button" onClick={() => setIsPaymentFormOpen(true)}>
                + Добавить платёж
              </button>
            )}
          </div>

          {isPaymentFormOpen && (
            <AddPaymentForm
              orderId={order.id}
              orderNumber={order.order_number}
              onPaymentAdded={async () => {
                await loadPayments();
                setIsPaymentFormOpen(false);
              }}
            />
          )}

          {!paymentsLoading && payments.length > 0 && (
            <>
              <div
                className={`${styles.paymentsList} ${
                  pageLoading ? styles.paginationLoading : ""
                }`}
              >
                {currentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className={`${styles.paymentItem} ${
                      payment.status === "cancelled"
                        ? styles.cancelledPayment
                        : ""
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

              <PaginationControls
                totalPages={totalPages}
                currentPage={currentPage}
                clickHandler={handlePageChange}
                compact
              />
            </>
          )}
        </div>

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
