"use client";

import Link from "next/link";
import { Box, Calendar } from "lucide-react";
import { validateOrderStatus } from "@/helpers";
import styles from "../page.module.css";

interface OrderCardProps {
  order: {
    id: string | number;
    order_number: string | number;
    start_date?: string;
    end_date?: string;
    status: string;
    total_price: number;
    order_items?: Array<{ start_date: string; end_date: string }>;
  };
  variant?: "active" | "list";
}

export default function OrderCard({ order, variant = "list" }: OrderCardProps) {
  const status = validateOrderStatus(order.status);

  const firstItem = order.order_items?.[0];
  const startDate = firstItem?.start_date || order.start_date;
  const endDate = firstItem?.end_date || order.end_date;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "—";
    }
  };

  // --- ВАРИАНТ 1: Активная карточка (Крупная) ---
  if (variant === "active") {
    return (
      <Link href={`/orders/${order.id}`} className={styles.activeCard}>
        <div className={styles.activeCardContent}>
          {/* Верхний ряд: Основная инфа */}
          <div className={styles.activeCardMain}>
            <div className={styles.toolIconBox}>
              <Box size={22} strokeWidth={2.5} />
            </div>
            <div className={styles.activeCardText}>
              <span className={styles.activeCardLabel}>
                Заказ #{order.order_number}
              </span>
            </div>
          </div>

          <div className={styles.activeCardStatus}>
            <span
              className={`${styles.statusBadge} ${styles[status.className]}`}
            >
              {status.text}
            </span>
          </div>
        </div>

        {/* Нижний ряд: Даты и Цена */}
        <div className={styles.activeCardDetails}>
          <div className={styles.detailItem}>
            <Calendar size={14} />
            <span>
              {formatDate(startDate)} — {formatDate(endDate)}
            </span>
          </div>
          <div className={styles.activeCardPrice}>
            {order.total_price.toLocaleString()} ₽
          </div>
        </div>
      </Link>
    );
  }

  // --- ВАРИАНТ 2: Список истории (Компактный) ---
  return (
    <Link href={`/orders/${order.id}`} className={styles.listCard}>
      <div className={styles.colId}>
        <span className={styles.listValueBold}>#{order.order_number}</span>
      </div>

      <div className={styles.colDate}>
        <span className={styles.listLabelMobile}>Даты:</span>
        <span>
          {formatDate(startDate)} — {formatDate(endDate)}
        </span>
      </div>

      <div className={styles.colPrice}>
        <span className={styles.listLabelMobile}>Сумма:</span>
        {order.total_price} ₽
      </div>

      <div className={styles.colStatus}>
        <span className={`${styles.statusBadge} ${styles[status.className]}`}>
          {status.text}
        </span>
      </div>
    </Link>
  );
}
