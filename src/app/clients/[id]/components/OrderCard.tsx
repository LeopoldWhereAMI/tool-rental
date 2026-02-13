"use client";

import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { validateOrderStatus } from "@/helpers";
import styles from "../page.module.css";

interface OrderCardProps {
  order: {
    id: string | number;
    order_number: string | number;
    start_date: string;
    end_date: string;
    status: string;
    total_price: number;
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  const status = validateOrderStatus(order.status);

  return (
    <Link href={`/orders/${order.id}`} className={styles.orderCard}>
      <div className={styles.orderMain}>
        <ShoppingBag size={20} className={styles.orderIcon} />
        <div>
          <div className={styles.orderNumber}>Заказ №{order.order_number}</div>
          <div className={styles.orderDates}>
            {new Date(order.start_date).toLocaleDateString()} —{" "}
            {new Date(order.end_date).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className={styles.orderMeta}>
        <span className={`${styles.statusBadge} ${styles[status.className]}`}>
          {status.text}
        </span>
        <span className={styles.orderPrice}>{order.total_price} ₽</span>
        {/* <ChevronRight size={18} /> */}
      </div>
    </Link>
  );
}
