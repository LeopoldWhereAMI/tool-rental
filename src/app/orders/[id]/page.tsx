"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/services/orderService";
import { OrderDetailsUI, OrderPrintBundle } from "@/types";
import { getOrderDateRange, validateOrderStatus } from "@/helpers";
import { CreditCard, Printer, Timer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import PrintArea from "@/components/Print/PrintArea/PrintArea";
import { mapOrderDetailsToPrint } from "@/lib/mappers/orderMapper";
import OrderClientInfo from "./components/OrderClientInfo";
import OrderItemsList from "./components/OrderItemsList";
import OrderFinance from "./components/OrderFinance";
import OrderDetailsSkeleton from "./OrderDetailsSkeleton";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import { OrderStatusJourney } from "../components/OrderStatusJourney/OrderStatusJourney";
import PageContainer from "@/components/PageContainer/PageContainer";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
// import OrderNotes from "./components/OrderNotes";
import { PrintLoadingOverlay } from "@/components/ui/PrintLoadingOverlay/PrintLoadingOverlay";
import { getPassport } from "@/services/passportService";
import styles from "./page.module.css";
import OrderNotes from "./components/OrderNotes/OrderNotes";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetailsUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [financeData, setFinanceData] = useState({
    finalAmount: 0,
    adjustment: 0,
  });
  const [printData, setPrintData] = useState<OrderPrintBundle | null>(null);
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

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

  const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getOrderById(id as string);

      setOrder(data);
      if (data) {
        setFinanceData({ finalAmount: data.total_price, adjustment: 0 });
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
          </div>

          <aside className={styles.sidebar}>
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
                  onFinanceUpdate={setFinanceData}
                />
              </section>
            )}

            <section className={styles.sidebarCard}>
              <OrderClientInfo client={order.client} />
            </section>
          </aside>
        </div>

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
