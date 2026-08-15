"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, CreditCard, X } from "lucide-react";
import { toast } from "sonner";
import { OrderDetailsUI } from "@/types";
import {
  getTransactions,
  Transaction,
  updateTransactionStatus,
} from "@/services/financeService";

import AddPaymentForm from "../AddPaymentForm/AddPaymentForm";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import usePagination from "@/hooks/usePagination";
import styles from "./OrderPayments.module.css";

type OrderPaymentsProps = {
  orderId: string;
  orderNumber: OrderDetailsUI["order_number"];
};

export default function OrderPayments({
  orderId,
  orderNumber,
}: OrderPaymentsProps) {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    currentPage,
    totalPages,
    currentItems: currentPayments,
    handlePageChange,
    pageLoading,
  } = usePagination({
    items: payments,
    itemsPerPage: 5,
  });

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

  return (
    <div>
      <button
        type="button"
        className={styles.paymentsTitle}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {/* <span className={styles.paymentsTitleLeft}>
          <CreditCard size={20} />
          <h3>Платежи</h3>
        </span> */}
        <span className={styles.paymentsTitleLeft}>
          <CreditCard size={20} />
          <span className={styles.paymentsTitleText}>Платежи</span>
        </span>

        <ChevronDown
          size={16}
          className={`${styles.paymentsArrow} ${
            isExpanded ? styles.paymentsArrowOpen : ""
          }`}
        />
      </button>

      <div className={styles.paymentsHeader}>
        {!isPaymentFormOpen && (
          <button type="button" onClick={() => setIsPaymentFormOpen(true)}>
            + Добавить платёж
          </button>
        )}
      </div>

      <div
        className={`${styles.paymentFormWrapper} ${
          isPaymentFormOpen ? styles.paymentFormWrapperOpen : ""
        }`}
      >
        <div className={styles.paymentFormInner}>
          <AddPaymentForm
            orderId={orderId}
            orderNumber={orderNumber}
            onPaymentAdded={async () => {
              await loadPayments();
              setIsPaymentFormOpen(false);
            }}
          />
        </div>
      </div>

      {!paymentsLoading && payments.length > 0 && (
        <div
          className={`${styles.paymentsContent} ${
            isExpanded ? styles.paymentsContentOpen : ""
          }`}
        >
          <div className={styles.paymentsContentInner}>
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

            {totalPages > 1 && (
              <PaginationControls
                totalPages={totalPages}
                currentPage={currentPage}
                clickHandler={handlePageChange}
                compact
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
