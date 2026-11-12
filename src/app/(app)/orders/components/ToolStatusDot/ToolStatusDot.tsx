import styles from "../OrdersTable/OrdersTable.module.css";
import { calculateReturnStatus } from "@/helpers";

interface ToolStatusDotProps {
  endDate: string | null;
  orderStatus: string;

  className?: string;
}

export default function ToolStatusDot({
  endDate,
  orderStatus,
  className = "",
}: ToolStatusDotProps) {
  const toolStatus = calculateReturnStatus(endDate || "", orderStatus);

  let toolDotClass = styles.badgePending;

  if (orderStatus === "cancelled") {
    toolDotClass = styles.badgeCancelled;
  } else if (orderStatus === "completed") {
    toolDotClass = styles.badgeCompleted;
  } else if (toolStatus.type === "overdue") {
    toolDotClass = styles.badgeOverdue;
  } else if (toolStatus.text === "Сегодня возврат") {
    toolDotClass = styles.badgeToday;
  }

  return (
    <span className={`${styles.toolDot} ${toolDotClass} ${className}`}>•</span>
  );
}
