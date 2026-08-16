"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById, updateOrderStatus } from "@/services/orderService";
import { OrderDetailsUI, OrderPrintBundle } from "@/types";
import { getOrderDateRange, validateOrderStatus } from "@/helpers";
import { CreditCard, Printer, Timer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import PrintArea from "@/components/Print/PrintArea/PrintArea";
import { mapOrderDetailsToPrint } from "@/lib/mappers/orderMapper";
import OrderClientInfo from "./components/OrderClientInfo";
import OrderItemsList from "./components/OrderItemsList";
import OrderFinance from "./components/OrderFinance/OrderFinance";
import OrderDetailsSkeleton from "./OrderDetailsSkeleton";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import { OrderStatusJourney } from "../components/OrderStatusJourney/OrderStatusJourney";
import PageContainer from "@/components/PageContainer/PageContainer";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { PrintLoadingOverlay } from "@/components/ui/PrintLoadingOverlay/PrintLoadingOverlay";
import { getPassport } from "@/services/passportService";
import styles from "./page.module.css";
import OrderNotes from "./components/OrderNotes/OrderNotes";
import OrderCompletionControls from "./components/OrderCompletionControls/OrderCompletionControls";
import { onOrderCompleted } from "@/helpers/financeIntegration";
import { processOrderMaintenance } from "@/services/inventoryService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CompleteOrderModal from "@/components/ui/MyModal/CompliteOrderModal";
import OrderPayments from "./components/OrderPayments/OrderPayments";
import { getTransactions } from "@/services/financeService";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetailsUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [financeData, setFinanceData] = useState({
    finalAmount: 0,
    additionalPayment: 0,
    adjustment: 0,
    debtAmount: 0,
    additionalPayments: 0,
  });

  const [printData, setPrintData] = useState<OrderPrintBundle | null>(null);
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);
  const [adjustment, setAdjustment] = useState<number | string>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handlePrintInitiation = async () => {
    if (!order) return;

    try {
      let passport = {
        passport_series: "",
        passport_number: "",
        issued_by: "",
        issue_date: "",
        registration_address: "",
      };

      if (order.client.client_type === "individual") {
        const clientPassport = await getPassport(order.client.id);

        if (clientPassport) {
          passport = clientPassport;
        }
      }

      const data = mapOrderDetailsToPrint(
        order,
        passport,
        financeData.finalAmount,
        financeData.adjustment,
      );

      setIsPreparingPrint(true);
      setPrintData(data);
    } catch (error) {
      console.error("Ошибка загрузки паспорта:", error);
      setIsPreparingPrint(false);
    }
  };

  const handleCancelPrint = () => {
    setIsPreparingPrint(false);
    setPrintData(null);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Договор_№${order?.order_number || "заказ"}`,
    onAfterPrint: () => {
      setPrintData(null);
      setIsPreparingPrint(false);
    },
  });

  const handleConfirm = async () => {
    if (isSubmitting) return;
    if (!order) return;

    setIsSubmitting(true);

    try {
      await updateOrderStatus(order.id, "completed", financeData.finalAmount);

      if (financeData.additionalPayment !== 0) {
        const desc = `Доплата по заказу #${order.order_number}${
          financeData.debtAmount > 0 ? " (просрочка)" : ""
        }`;

        await onOrderCompleted(order.id, financeData.additionalPayment, desc);
      }

      await processOrderMaintenance(order);

      const isRefund = financeData.additionalPayment < 0;
      const absAmount = Math.abs(financeData.additionalPayment);

      toast.success(
        isRefund
          ? `Возврат ${absAmount} ₽ оформлен. Заказ закрыт.`
          : `Доплата ${financeData.additionalPayment} ₽ принята. Заказ закрыт.`,
      );

      setIsModalOpen(false);

      await loadOrder();

      router.refresh();
    } catch (err) {
      toast.error("Ошибка при завершении заказа");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getOrderById(id as string);

      const { transactions } = await getTransactions(
        1,
        100,
        undefined,
        id as string,
      );

      const additionalPayments = transactions
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

      if (data) {
        setFinanceData((prev) => ({
          ...prev,
          additionalPayments,
        }));
      }
    } catch (err) {
      console.error("Ошибка загрузки заказа:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleItemReturned = () => {
    loadOrder();
  };

  const orderDates = useMemo(
    () => getOrderDateRange(order?.order_items ?? []),
    [order?.order_items],
  );

  const breadcrumbItems = [
    { label: "Заказы", href: "/orders" },
    { label: `№ ${order?.order_number}` },
  ];

  const handleCompleteRequest = () => {
    if (order?.status === "completed") return;

    setIsModalOpen(true);
  };

  const handleFinanceUpdate = useCallback(
    (data: {
      finalAmount: number;
      additionalPayment: number;
      adjustment: number;
      debtAmount: number;
    }) => {
      setFinanceData((prev) => ({
        ...prev,
        ...data,
      }));
    },
    [],
  );

  if (loading) return <OrderDetailsSkeleton />;

  if (!order)
    return (
      <ErrorBlock message="Заказ не найден или возникла ошибка при загрузке" />
    );

  const statusInfo = validateOrderStatus(order.status);
  const statusClass = styles[statusInfo.className as keyof typeof styles] || "";

  const items = order.order_items;

  return (
    <PageContainer>
      <div className={styles.pageContainer}>
        <div className={styles.topNav}>
          <div className={styles.navLeft}>
            <Breadcrumbs
              items={breadcrumbItems}
              extra={
                <span className={`${styles.statusBadge} ${statusClass}`}>
                  {statusInfo.text.toUpperCase()}
                </span>
              }
            />
          </div>
        </div>
        <div className={styles.rentedToolsHeader}>
          <div className={styles.titleItems}>
            <div className={styles.titleGroup}>
              <h2>Арендованные инструменты</h2>
              <span className={styles.itemCountBadge}>
                {items?.length || 0} поз.
              </span>
            </div>
            <div className={styles.deadlineBanner}>
              <div className={styles.deadlineText}>
                <span className={styles.deadlineLabel}>Срок возврата</span>
                <span className={styles.deadlineDate}>
                  {orderDates.end
                    ? new Date(orderDates.end).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.navActions}>
            <button
              onClick={handlePrintInitiation}
              className={styles.printBtn}
              disabled={isPreparingPrint}
            >
              <Printer size={18} />
              <span>Печать договора</span>
            </button>
          </div>
        </div>
        <div className={styles.mainGrid}>
          <div className={styles.contentArea}>
            <OrderItemsList
              items={items}
              orderStatus={order.status}
              orderId={order.id}
              onItemReturned={handleItemReturned}
            />

            {order.status === "cancelled" ? (
              <section className={styles.sidebarCard}>
                <div className={styles.cancelledFinance}>
                  <div className={styles.cancelledFinanceHeader}>
                    <CreditCard size={16} />
                    <span>Финансы</span>
                  </div>
                  <div className={styles.cancelledFinanceBody}>
                    <span className={styles.cancelledLabel}>Заказ отменён</span>
                    <span className={styles.cancelledAmount}>
                      {order.total_price} ₽
                    </span>
                  </div>
                  {order.security_deposit ? (
                    <div className={styles.cancelledDeposit}>
                      <span>Обеспечительный платёж</span>
                      <span>{order.security_deposit} ₽</span>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : (
              <section className={styles.sidebarCard}>
                <OrderFinance
                  totalPrice={order.total_price}
                  order={order}
                  adjustment={adjustment}
                  // onFinanceUpdate={setFinanceData}
                  onFinanceUpdate={handleFinanceUpdate}
                  additionalPayments={financeData.additionalPayments}
                />
              </section>
            )}
            <section className={styles.sidebarCard}>
              <OrderPayments
                orderId={order.id}
                orderNumber={order.order_number}
                onPaymentChanged={loadOrder}
              />
            </section>
          </div>

          <aside className={styles.sidebar}>
            {order.status !== "completed" && (
              <OrderCompletionControls
                adjustment={adjustment}
                onAdjustmentChange={setAdjustment}
                additionalPayment={financeData.additionalPayment}
                securityDeposit={order.security_deposit ?? 0}
                onComplete={handleCompleteRequest}
                isSubmitting={isSubmitting}
              />
            )}

            <section className={styles.sidebarCard}>
              <OrderClientInfo client={order.client} />
            </section>
            <section className={styles.whiteBox}>
              <div className={styles.boxHeader}>
                <Timer size={18} />
                <h3>Статус выполнения</h3>
              </div>
              <OrderStatusJourney
                status={order.status}
                dates={{
                  start:
                    orderDates.start?.toISOString() || new Date().toISOString(),
                  end:
                    orderDates.end?.toISOString() || new Date().toISOString(),
                }}
              />
            </section>
            <OrderNotes orderId={order.id} initialNotes={order.notes} />
          </aside>
        </div>

        <CompleteOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          finalAmount={financeData.additionalPayment}
          onConfirm={handleConfirm}
          loading={isSubmitting}
        />

        <PrintLoadingOverlay
          isVisible={isPreparingPrint}
          onCancel={handleCancelPrint}
        />

        {printData && (
          <PrintArea
            printRef={printRef}
            data={printData}
            onReady={handlePrint}
          />
        )}
      </div>
    </PageContainer>
  );
}
