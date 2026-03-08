"use client";

import styles from "./OrdersTable.module.css";
import { OrderUI } from "@/types";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import { EllipsisVertical, Eye } from "lucide-react";
import Link from "next/link";
import ToolStatusDot from "../ToolStatusDot/ToolStatusDot";

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
    statusText,
    statusVariant,
    formattedStartDate,
    formattedDate,
  } = useOrderStatusInfo(order);

  const clientName = `${order.client.last_name} ${order.client.first_name}`;
  const clientPhone = order.client.phone || "";
  const statusClass = statusVariant
    ? styles[statusVariant as keyof typeof styles]
    : "";

  const toolsList = order.tools?.length ? (
    <div className={styles.toolsWrapper}>
      {order.tools.map((t) => (
        <div key={t.id} className={styles.toolItem}>
          <ToolStatusDot endDate={t.end_date} orderStatus={order.status} />

          <Link href={`/inventory/${t.id}`} className={styles.toolNameLink}>
            {t.name}
          </Link>
        </div>
      ))}
    </div>
  ) : (
    <div className={styles.toolItem}>
      <ToolStatusDot endDate={order.end_date} orderStatus={order.status} />
      {order.inventory?.name}
    </div>
  );

  return (
    <tr className={`${styles.row} ${isOverdue ? styles.rowOverdue : ""}`}>
      <td className={styles.orderId}>#{order.order_number}</td>

      <td className={styles.tools}>{toolsList}</td>

      <td className={styles.client}>
        <Link
          href={`/clients/${order.client.id}`}
          className={styles.clientLink}
        >
          <div className={styles.clientName}>{clientName}</div>
        </Link>

        {clientPhone && (
          <a href={`tel:${clientPhone}`} className={styles.phone}>
            {clientPhone}
          </a>
        )}
      </td>

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
