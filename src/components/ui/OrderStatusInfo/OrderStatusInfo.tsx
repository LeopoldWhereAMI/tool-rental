import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import styles from "./OrderStatusInfo.module.css";
import { OrderDetailsUI, OrderUI } from "@/types";

type OrderStatusInfoProps = {
  order: OrderUI | OrderDetailsUI;
  showStatusText?: boolean;
};

export default function OrderStatusInfo({ order }: OrderStatusInfoProps) {
  const { returnStatus, formattedDate, hasValidDate } =
    useOrderStatusInfo(order);

  if (!hasValidDate || formattedDate === "—") return null;

  return (
    <div className={`${styles.returnStatus} ${styles[returnStatus.type]}`}>
      <span className={styles.statusText}>
        {returnStatus.type === "overdue" ? returnStatus.text : formattedDate}
      </span>
    </div>
  );
}
