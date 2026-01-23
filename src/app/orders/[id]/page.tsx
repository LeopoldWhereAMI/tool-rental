"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/services/orderService";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import styles from "./page.module.css";
import { OrderUI } from "@/types";
import { validateOrderStatus } from "@/helpers";
import { Calendar, CreditCard, Phone, ToolCase } from "lucide-react";
import BackButton from "@/components/BackButton/BackButton";

export default function OrderDetailsPage() {
  const { id } = useParams();

  const [order, setOrder] = useState<OrderUI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getOrderById(id as string)
        .then(setOrder)
        .catch((err) => console.error("Ошибка загрузки заказа:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div>Загрузка заказа...</div>;
  if (!order) return <div>Заказ не найден</div>;

  const statusInfo = validateOrderStatus(order.status);
  const statusClass = styles[statusInfo.className as keyof typeof styles] || "";

  return (
    <PageWrapper>
      <div className={styles.topNav}>
        <BackButton>Назад к списку</BackButton>
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
              Создан: {new Date(order.start_date).toLocaleDateString()}
            </div>
          </header>

          <div className={styles.infoGrid}>
            {/* Карточка Клиента */}
            <div className={styles.infoBlock}>
              <div className={styles.blockTitle}>
                <Phone size={20} /> <h3>Клиент</h3>
              </div>
              <div className={styles.blockContent}>
                <p className={styles.name}>
                  {order.client?.last_name} {order.client?.first_name}
                </p>
                <p className={styles.subText}>
                  Телефон: {order.client?.phone || "не указан"}
                </p>
              </div>
            </div>

            {/* Карточка Инструмента */}
            <div className={styles.infoBlock}>
              <div className={styles.blockTitle}>
                <ToolCase size={20} /> <h3>Инструмент</h3>
              </div>
              <div className={styles.blockContent}>
                <p className={styles.name}>{order.inventory?.name}</p>

                {/* Добавляем серийный номер и артикул */}
                <div className={styles.detailRow}>
                  <span className={styles.label}>S/N:</span>
                  <span className={styles.value}>
                    {order.inventory?.serial_number || "—"}
                  </span>
                </div>
                {order.inventory?.article && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Артикул:</span>
                    <span className={styles.value}>
                      {order.inventory.article}
                    </span>
                  </div>
                )}

                <p className={styles.subText}>
                  Суточная цена: {order.inventory?.daily_price} руб.
                </p>
              </div>
            </div>

            {/* Карточка Сроков */}
            <div className={styles.infoBlock}>
              <div className={styles.blockTitle}>
                <Calendar size={20} /> <h3>Период проката</h3>
              </div>
              <div className={styles.blockContent}>
                <div className={styles.dates}>
                  <div>
                    <span>С:</span>{" "}
                    <strong>
                      {new Date(order.start_date).toLocaleDateString()}
                    </strong>
                  </div>
                  <div>
                    <span>По:</span>{" "}
                    <strong>
                      {new Date(order.end_date).toLocaleDateString()}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Финансовый блок */}
            <div className={`${styles.infoBlock} ${styles.totalBlock}`}>
              <div className={styles.blockTitle}>
                <CreditCard size={20} /> <h3>Оплата</h3>
              </div>
              <div className={styles.blockContent}>
                <p className={styles.totalLabel}>Итого к оплате</p>
                <p className={styles.price}>{order.total_price} ₽</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
