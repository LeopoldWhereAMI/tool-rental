import { OrderUI } from "@/types";
import styles from "../page.module.css";

import { validateOrderStatus } from "@/helpers";
import { AlertCircle, EllipsisVertical } from "lucide-react";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import OrderStatusInfo from "@/components/ui/OrderStatusInfo/OrderStatusInfo";

type OrderItemProps = {
  order: OrderUI;
  isOpen: boolean;
  anchor: { top: number; left: number } | null;
  onToggleMenu: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
};

/* width: calc(100% + 36px); */

export default function OrderItem({
  order,
  isOpen,
  anchor,
  onToggleMenu,
  onClose,
  onStatusUpdate,
  onDeleteClick,
}: OrderItemProps) {
  const { isOverdue, isActive, returnStatus } = useOrderStatusInfo(order);
  const tooltipText =
    returnStatus?.text !== "—" ? returnStatus.text : undefined;
  const statusInfo = validateOrderStatus(order.status);
  const statusClass = styles[statusInfo.className as keyof typeof styles] || "";

  const rowClass = `
  ${isActive ? styles.activeRow : ""} 
  ${isOverdue ? styles.overdueRow : ""}
  
`.trim();

  return (
    <tr key={order.id} className={rowClass} title={tooltipText}>
      <td className={styles.orderNumberCell} data-label="Заказ">
        <div className={styles.cellInner}>
          <span className={`${styles.statusBadge} ${statusClass}`}>
            {statusInfo.text}
          </span>
          <span className={styles.primaryText}>№{order.order_number}</span>
        </div>
      </td>

      <td className={styles.clientCell} data-label="Клиент">
        <div className={styles.cellInner}>
          <div className={styles.primaryText}>
            {order.client?.last_name} {order.client?.first_name}
          </div>
          <a
            href={`tel:${order.client?.phone}`}
            className={`${styles.secondaryText} ${styles.phoneLink}`}
          >
            {order.client?.phone || "—"}
          </a>
        </div>
      </td>

      <td className={styles.toolListCell} data-label="Инструменты">
        {order.tools && order.tools.length > 0 ? (
          <div className={styles.toolList}>
            {order.tools.map((tool, index) => (
              <div
                key={`${order.id}-${tool.id}-${index}`}
                className={styles.toolItem}
              >
                <span className={styles.toolMarker}></span>
                <span className={styles.toolName}>{tool.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <span>{order.inventory?.name || "Нет данных"}</span>
        )}
      </td>

      <td className={styles.statusCell} data-label="Статус">
        <OrderStatusInfo order={order} showStatusText={false} />
      </td>

      <td className={styles.priceCell} data-label="Сумма">
        <div className={styles.priceContainer}>
          {order.total_price} руб.
          {isOverdue && <AlertCircle size={16} color="#e11d48" />}
        </div>
      </td>

      <td className={styles.actionsCell}>
        <button
          data-menu-trigger={order.id}
          className={styles.actionButton}
          onClick={(e) => onToggleMenu(e, order.id)}
        >
          <EllipsisVertical size={16} />
        </button>

        {isOpen && (
          <ActionsMenu
            id={order.id}
            type="order"
            anchor={anchor}
            currentStatus={order.status}
            onClose={onClose}
            onStatusUpdate={onStatusUpdate}
            onDeleteClick={() => onDeleteClick(order.id)}
          />
        )}
      </td>
    </tr>
  );
}
