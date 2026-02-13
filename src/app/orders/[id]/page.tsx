"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/services/orderService";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import styles from "./page.module.css";
import { OrderDetailsUI } from "@/types";
import { getOrderDateRange, validateOrderStatus } from "@/helpers";
import { Printer } from "lucide-react";
import BackButton from "@/components/BackButton/BackButton";
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

  return (
    <PageWrapper>
      <div className={styles.topNav}>
        <BackButton href="/orders" />
        {order && (
          <button
            onClick={() => setShowPassportModal(true)}
            className={styles.printBtn}
          >
            <Printer size={18} />
            <span>Печать</span>
            <span className="hideOnMobile"> договора</span>
          </button>
        )}
      </div>
      <div className={styles.container}>
        <div className={styles.mainCard}>
          <header className={styles.header}>
            <div className={styles.titleInfo}>
              <h1>Заказ №{order.order_number}</h1>
              <span className={`${styles.statusBadge} ${statusClass}`}>
                {statusInfo.text}
              </span>
            </div>
            <div className={styles.dateInfo}>
              Создан: {new Date(order.created_at).toLocaleDateString()}
            </div>
          </header>

          <div className={styles.infoGrid}>
            <OrderClientInfo client={order.client} />
            <OrderPeriod
              start={orderDates.start}
              end={orderDates.end}
              order={order}
            />
            <OrderItemsList items={order.order_items} />
            <OrderFinance
              totalPrice={order.total_price}
              order={order}
              onFinalAmountChange={setActualTotal}
            />
          </div>
        </div>
      </div>

      {/* Модальное окно ввода паспортных данных */}
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
    </PageWrapper>
  );
}
