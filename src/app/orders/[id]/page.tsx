"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/services/orderService";
import styles from "./page.module.css";
import { OrderDetailsUI } from "@/types";
import { getOrderDateRange, validateOrderStatus } from "@/helpers";
import { CreditCard, Printer, Timer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import {
  PassportInput,
  passportValidationSchema,
} from "@/lib/validators/orderSchema";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PassportModal from "@/components/ui/PassportModal/PassportModal";
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
import OrderNotes from "./components/OrderNotes";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetailsUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [actualTotal, setActualTotal] = useState<number>(0);
  const printRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PassportInput>({
    resolver: zodResolver(passportValidationSchema),
    mode: "onTouched",
    defaultValues: {
      passport_series: "",
      passport_number: "",
      issued_by: "",
      issue_date: "",
      registration_address: "",
    },
  });

  const passportData = useWatch({
    control,
    name: [
      "passport_series",
      "passport_number",
      "issued_by",
      "issue_date",
      "registration_address",
    ],
  });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Договор_№${order?.order_number || "заказ"}`,
  });

  const onPassportSubmit = () => {
    setShowPassportModal(false);

    setTimeout(() => {
      handlePrint();
    }, 500);
  };

  useEffect(() => {
    if (id) {
      getOrderById(id as string)
        .then((data) => {
          setOrder(data);
          if (data) {
            setActualTotal(data.total_price);
          }
        })
        .catch((err) => console.error("Ошибка загрузки заказа:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const orderDates = useMemo(
    () => getOrderDateRange(order?.order_items || []),
    [order],
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
              onClick={() => setShowPassportModal(true)}
              className={styles.printBtn}
            >
              <Printer size={18} />
              <span>Печать договора</span>
            </button>
          </div>
        </div>
        <div className={styles.mainGrid}>
          <div className={styles.contentArea}>
            <OrderItemsList items={items} orderStatus={order.status} />

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
            <section className={styles.sidebarCard}>
              <OrderClientInfo client={order.client} />
            </section>

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
                  onFinalAmountChange={setActualTotal}
                />
              </section>
            )}
          </aside>
        </div>

        {showPassportModal && (
          <PassportModal
            onPassportSubmit={handleSubmit(onPassportSubmit)}
            onClose={() => setShowPassportModal(false)}
            register={register}
            errors={errors}
          />
        )}

        <PrintArea
          printRef={printRef}
          data={mapOrderDetailsToPrint(order, passportData, actualTotal)}
        />
      </div>
    </PageContainer>
  );
}
