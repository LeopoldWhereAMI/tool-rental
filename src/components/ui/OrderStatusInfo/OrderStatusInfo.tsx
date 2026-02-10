import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import styles from "./OrderStatusInfo.module.css";
import { OrderDetailsUI, OrderUI } from "@/types";

type OrderStatusInfoProps = {
  order: OrderUI | OrderDetailsUI;
  showStatusText?: boolean;
};

export default function OrderStatusInfo({
  order,
  showStatusText = true,
}: OrderStatusInfoProps) {
  const { returnStatus, isActive, formattedDate, hasValidDate } =
    useOrderStatusInfo(order);

  if (!hasValidDate || formattedDate === "—") return null;
  const isCompleted = returnStatus.type === "completed";

  return (
    <div className={`${styles.returnStatus} ${styles[returnStatus.type]}`}>
      <span className={styles.dateLabel}>
        {isActive ? `до ${formattedDate}` : formattedDate}
      </span>

      {showStatusText && (isActive || isCompleted) && (
        <span className={styles.statusText}>{returnStatus.text}</span>
      )}
    </div>
  );
}
