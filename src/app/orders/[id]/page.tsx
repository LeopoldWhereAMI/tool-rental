"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderDateRange, validateOrderStatus } from "@/helpers";
import { CreditCard, Printer, Timer } from "lucide-react";
import PrintArea from "@/components/Print/PrintArea/PrintArea";
import OrderClientInfo from "./components/OrderClientInfo";
import OrderItemsList from "./components/OrderItemsList";
import OrderFinance from "./components/OrderFinance/OrderFinance";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import { OrderStatusJourney } from "../components/OrderStatusJourney/OrderStatusJourney";
import PageContainer from "@/components/PageContainer/PageContainer";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { PrintLoadingOverlay } from "@/components/ui/PrintLoadingOverlay/PrintLoadingOverlay";
import styles from "./page.module.css";
import OrderNotes from "./components/OrderNotes/OrderNotes";
import OrderCompletionControls from "./components/OrderCompletionControls/OrderCompletionControls";
import { useRouter } from "next/navigation";
import CompleteOrderModal from "@/components/ui/MyModal/CompliteOrderModal";
import OrderPayments from "./components/OrderPayments/OrderPayments";
import { useOrderDetails } from "./hooks/useOrderDetails";
import { useOrderCompletion } from "./hooks/useOrderCompletion";
import { useOrderPrint } from "./hooks/useOrderPrint";
import Spinner from "@/components/ui/Spinner/Spinner";

export default function OrderDetailsPage() {
  const { id } = useParams();

  const { order, loading, additionalPayments, loadOrder } = useOrderDetails(id);
  const [financeData, setFinanceData] = useState({
    finalAmount: 0,
    additionalPayment: 0,
    adjustment: 0,
    debtAmount: 0,
  });
  const { completeOrder, isSubmitting } = useOrderCompletion({
    order,
    financeData,
    onCompleted: async () => {
      setIsModalOpen(false);
      await loadOrder();
      router.refresh();
    },
  });
  const {
    printData,
    isPreparingPrint,
    printRef,
    handlePrintInitiation,
    handleCancelPrint,
    handlePrint,
  } = useOrderPrint(order, financeData.finalAmount, financeData.adjustment);

  const [adjustment, setAdjustment] = useState<number | string>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

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

  if (loading) {
    return (
      <PageContainer>
        <div className={styles.loading}>
          <Spinner size={22} />
          <span>Загрузка заказа…</span>
        </div>
      </PageContainer>
    );
  }

  if (!order)
    return (
      <ErrorBlock message="Заказ не найден или возникла ошибка при загрузке" />
    );

  const statusInfo = validateOrderStatus(order.status);
  const statusClass = styles[statusInfo.className as keyof typeof styles] || "";

  const items = order.order_items;

  return (
    <PageContainer>
      <div className={`${styles.pageContainer} ${styles.fadeIn}`}>
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
              extensions={order.extensions}
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
                  onFinanceUpdate={handleFinanceUpdate}
                  additionalPayments={additionalPayments}
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
          onConfirm={completeOrder}
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
