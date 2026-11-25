import OrderCard from "./OrderCard";
import { Clock } from "lucide-react";
import styles from "../page.module.css";
import { OrderUI } from "@/types";

interface ActiveOrdersProps {
  orders: OrderUI[];
}

export default function ActiveOrders({ orders }: ActiveOrdersProps) {
  if (orders.length === 0) return null;

  return (
    <section className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Clock size={20} className={styles.titleIcon} /> Активные аренды
        </h2>
        <span className={styles.badgeCount}>{orders.length} активных</span>
      </div>
      <div className={styles.activeGrid}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} variant="active" />
        ))}
      </div>
    </section>
  );
}
