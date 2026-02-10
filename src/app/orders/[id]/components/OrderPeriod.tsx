import { Calendar } from "lucide-react";
import styles from "../page.module.css";
import OrderStatusInfo from "@/components/ui/OrderStatusInfo/OrderStatusInfo";
import { OrderDetailsUI } from "@/types";

type OrderPeriodProps = {
  start: Date | null;
  end: Date | null;
  order: OrderDetailsUI;
};

export default function OrderPeriod({ start, order }: OrderPeriodProps) {
  return (
    <div className={styles.infoBlock}>
      <div className={styles.blockTitle}>
        <Calendar size={18} /> <h3>Срок аренды</h3>
      </div>
      <div className={styles.blockContent}>
        <div className={styles.periodWrapper}>
          <div className={styles.startDateInfo}>
            <span className={styles.miniLabel}>Выдан:</span>
            <strong>{start?.toLocaleDateString() || "—"}</strong>
          </div>
          <div className={styles.divider} />
          <OrderStatusInfo order={order} />
        </div>
      </div>
    </div>
  );
}
