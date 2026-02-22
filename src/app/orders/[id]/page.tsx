"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/services/orderService";
// import PageWrapper from "@/components/PageWrapper/PageWrapper";
import styles from "./page.module.css";
import { OrderDetailsUI } from "@/types";
import {
  calculateDays,
  calculateItemTotal,
  getOrderDateRange,
  validateOrderStatus,
} from "@/helpers";
import { Calendar, ChevronRight, CreditCard, Printer } from "lucide-react";

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
import OrderPeriod from "./components/OrderPeriod";
import OrderFinance from "./components/OrderFinance";
import OrderDetailsSkeleton from "./OrderDetailsSkeleton";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import { OrderStatusJourney } from "../components/OrderStatusJourney/OrderStatusJourney";
import Image from "next/image";
import Link from "next/link";

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
            // Инициализируем сумму сразу при получении данных
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

  if (loading) return <OrderDetailsSkeleton />;

  if (!order)
    return (
      <ErrorBlock message="Заказ не найден или возникла ошибка при загрузке" />
    );

  const statusInfo = validateOrderStatus(order.status);
  const statusClass = styles[statusInfo.className as keyof typeof styles] || "";

  const items = order.order_items;
  const isSingleItem = items.length === 1;
  const mainItem = items[0];

  return (
    <div className={styles.pageContainer}>
      {/* Верхняя панель навигации */}
      <div className={styles.topNav}>
        <div className={styles.navLeft}>
          {/* <BackButton href="/orders" /> */}
          <nav className={styles.breadcrumbs}>
            <Link href="/orders" className={styles.breadcrumbLink}>
              Заказы
            </Link>

            <ChevronRight size={14} className={styles.breadcrumbSeparator} />

            <span className={styles.breadcrumbCurrent}>
              № {order.order_number}
            </span>

            {/* Бейдж статуса оставляем в конце, можно добавить небольшой отступ слева */}
            <span className={`${styles.statusBadge} ${statusClass}`}>
              {statusInfo.text.toUpperCase()}
            </span>
          </nav>
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
        {/* ЛЕВАЯ ЧАСТЬ: ИНСТРУМЕНТ И ПРОЦЕСС */}
        <div className={styles.contentArea}>
          {/* Главная карточка с фото */}

          {isSingleItem ? (
            /* ВАРИАНТ 1: ОДИН ИНСТРУМЕНТ (HERO) */
            <section className={styles.heroSection}>
              <div className={styles.heroImageWrapper}>
                <div className={styles.heroImageContainer}>
                  <Image
                    src={
                      mainItem?.inventory?.image_url || "/placeholder-tool.png"
                    }
                    alt={mainItem?.inventory?.name || "Tool Image"}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className={styles.heroImage}
                  />
                </div>
              </div>

              <div className={styles.heroDetails}>
                <div className={styles.heroTitleBlock}>
                  <h1>{mainItem?.inventory?.name}</h1>
                  <div className={styles.heroSecondaryInfo}>
                    <span className={styles.badgeBlue}>
                      S/N: {mainItem?.inventory?.serial_number || "—"}
                    </span>
                    <span className={styles.infoSeparator}>•</span>
                    <span className={styles.badgeBlue}>
                      Арт: {mainItem?.inventory?.article || "—"}
                    </span>
                  </div>
                </div>

                <section className={styles.sidebarCard}>
                  <OrderPeriod
                    start={orderDates.start}
                    end={orderDates.end}
                    order={order}
                  />
                </section>
                {/* </div> */}

                <div className={styles.heroMeta}>
                  <span>
                    Заказ создан:{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>

                  <div className={styles.heroPriceTag}>
                    {calculateItemTotal(
                      mainItem.start_date,
                      mainItem.end_date,
                      mainItem.price_at_time,
                    )}{" "}
                    ₽
                    <span className={styles.heroDaysLabel}>
                      ({calculateDays(mainItem.start_date, mainItem.end_date)}{" "}
                      дн.)
                    </span>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div>
              <OrderItemsList items={items} />
            </div>
          )}

          {/* Статус выполнения идет ниже в обоих случаях */}
          <section className={styles.whiteBox}>
            <div className={styles.boxHeader}>
              <h3>Статус выполнения</h3>
            </div>
            <OrderStatusJourney
              status={order.status}
              dates={{
                start:
                  orderDates.start?.toISOString() || new Date().toISOString(),
                end: orderDates.end?.toISOString() || new Date().toISOString(),
              }}
            />
          </section>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: САЙДБАР С ДЕТАЛЯМИ */}
        <aside className={styles.sidebar}>
          {/* Блок клиента */}
          <section className={styles.sidebarCard}>
            <OrderClientInfo client={order.client} />
          </section>

          {/* Блок финансов */}
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

          {/* Дедлайн */}
          <div className={styles.deadlineBanner}>
            <div className={styles.deadlineIcon}>
              <Calendar size={24} />
            </div>
            <div className={styles.deadlineText}>
              <span className={styles.deadlineLabel}>СРОК ВОЗВРАТА</span>
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
        </aside>
      </div>

      {/* Модалки (вне сетки) */}
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
  );
}
