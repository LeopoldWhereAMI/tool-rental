"use client";

import styles from "./OrdersTable.module.css";
import { OrderUI } from "@/types";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import { EllipsisVertical, Eye } from "lucide-react";
import Link from "next/link";

interface OrderRowProps {
  order: OrderUI;
  openMenuId: string | null;
  anchor: { top: number; left: number } | null;
  onToggleMenu: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
}

export default function OrderRow({
  order,
  openMenuId,
  anchor,
  onToggleMenu,
  onClose,
  onStatusUpdate,
  onDeleteClick,
}: OrderRowProps) {
  const {
    isOverdue,
    isActive,
    returnStatus,
    hasValidDate,
    isCompleted,
    formattedStartDate,
    formattedDate,
  } = useOrderStatusInfo(order);

  const clientName = `${order.client.last_name} ${order.client.first_name}`;
  const clientPhone = order.client.phone || "";

  // Определяем какой бейдж показывать
  let statusClass = "";
  let statusText = "";

  if (order.status === "cancelled") {
    statusClass = styles.badgeCancelled;
    statusText = "Отменён";
  } else if (isCompleted) {
    statusClass = styles.badgeCompleted;
    statusText = "Завершён";
  } else if (isOverdue) {
    statusClass = styles.badgeOverdue;
    statusText = returnStatus?.text || "Просрочено";
  } else if (returnStatus?.text === "Сегодня возврат") {
    statusClass = styles.badgeToday;
    statusText = "Сегодня возврат";
  } else if (isActive && hasValidDate && returnStatus?.text) {
    statusClass = styles.badgePending;
    statusText = returnStatus.text;
  }

  const dotColorClass = statusClass;

  const toolsList = order.tools?.length ? (
    <div className={styles.toolsWrapper}>
      {order.tools.map((t, idx) => (
        <div key={idx} className={styles.toolItem}>
          {/* Применяем statusClass напрямую к точке */}
          <span className={`${styles.toolDot} ${dotColorClass}`}>•</span>
          {t.name}
        </div>
      ))}
    </div>
  ) : (
    <div className={styles.toolItem}>
      <span className={`${styles.toolDot} ${dotColorClass}`}>•</span>
      {order.inventory?.name}
    </div>
  );
  return (
    <tr className={`${styles.row} ${isOverdue ? styles.rowOverdue : ""}`}>
      {/* № заказа */}
      <td className={styles.orderId}>#{order.order_number}</td>

      <td className={styles.tools}>{toolsList}</td>

      <td className={styles.client}>
        <div>{clientName}</div>
        {clientPhone && <span className={styles.phone}>{clientPhone}</span>}
      </td>

      {/* <td className={styles.period}>{period}</td> */}
      <td className={styles.periodCell}>
        <div className={styles.dateWrapper}>
          <div className={styles.dateBlock}>
            <span className={styles.month}>
              {formattedStartDate.split(" ")[1]}
            </span>
            <span className={styles.day}>
              {formattedStartDate.split(" ")[0]}
            </span>
          </div>

          <span className={styles.dateSeparator}>→</span>

          <div className={styles.dateBlock}>
            <span
              className={`${styles.month} ${isOverdue ? styles.monthOverdue : ""}`}
            >
              {formattedDate.split(" ")[1]}
            </span>
            <span
              className={`${styles.day} ${isOverdue ? styles.dayOverdue : ""}`}
            >
              {formattedDate.split(" ")[0]}
            </span>
          </div>
        </div>
      </td>

      <td className={styles.price}>{order.total_price} ₽</td>

      {/* ЕДИНСТВЕННАЯ КОЛОНКА СО СТАТУСОМ */}
      <td className={styles.statusCell}>
        {statusText && (
          <span className={`${styles.statusBadge} ${statusClass}`}>
            <span className={styles.statusDot}></span>
            {statusText}
          </span>
        )}
      </td>

      <td className={styles.actions}>
        <div className={styles.actionsWrapper}>
          <Link href={`/orders/${order.id}`} className={styles.viewButton}>
            <Eye size={18} />
          </Link>
          <button
            type="button"
            data-menu-trigger={order.id}
            className={styles.actionButton}
            onClick={(e) => onToggleMenu(e, order.id)}
          >
            <EllipsisVertical size={18} />
          </button>
        </div>
        {openMenuId === order.id && (
          <ActionsMenu
            id={order.id}
            type="order"
            currentStatus={order.status}
            onClose={onClose}
            onDeleteClick={() => onDeleteClick(order.id)}
            onStatusUpdate={onStatusUpdate}
            anchor={anchor}
          />
        )}
      </td>
    </tr>
  );
}
