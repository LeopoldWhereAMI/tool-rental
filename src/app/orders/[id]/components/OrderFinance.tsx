"use client";

import { CreditCard, X } from "lucide-react";
import { OrderDetailsUI } from "@/types";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";

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
  adjustment: number | string;

  onFinanceUpdate?: (data: {
    finalAmount: number;
    additionalPayment: number;
    adjustment: number;
    debtAmount: number;
  }) => void;
};

export default function OrderFinance({
  totalPrice,
  order,
  adjustment,
  onFinanceUpdate,
}: OrderFinanceProps) {
  const { debtAmount } = useOrderStatusInfo(order);

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

  const parsedAdjustment = Number(adjustment);
  const safeAdjustment = isNaN(parsedAdjustment) ? 0 : parsedAdjustment;
  const unpaidExtensions = extensions.reduce(
    (sum, extension) => sum + (extension.amount - extension.paid_amount),
    0,
  );

  const additionalPayment = debtAmount + unpaidExtensions + safeAdjustment;
  const fullContractAmount = totalPrice + debtAmount + safeAdjustment;

  useEffect(() => {
    onFinanceUpdate?.({
      finalAmount: fullContractAmount,
      additionalPayment,
      adjustment: safeAdjustment,
      debtAmount,
    });
  }, [
    fullContractAmount,
    additionalPayment,
    safeAdjustment,
    debtAmount,
    onFinanceUpdate,
  ]);

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
        <CreditCard size={20} /> <h3>Продления и платежи</h3>
      </div>
      <div className={`${styles.blockContent} ${styles.financeBlockContent}`}>
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

        {extensions.length > 0 ? (
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
        ) : (
          <div className={styles.emptyExtensions}>
            <span>Продлений нет</span>
          </div>
        )}

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
      </div>
    </div>
  );
}
