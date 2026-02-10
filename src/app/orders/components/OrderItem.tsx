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
  onToggleMenu: (id: string) => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
};

export default function OrderItem({
  order,
  isOpen,
  onToggleMenu,
  onStatusUpdate,
  onDeleteClick,
}: OrderItemProps) {
  const { isOverdue, isActive, returnStatus } = useOrderStatusInfo(order);
  const tooltipText =
    returnStatus?.text !== "—" ? returnStatus.text : undefined;
  const statusInfo = validateOrderStatus(order.status);
  const statusClass = styles[statusInfo.className as keyof typeof styles] || "";

  // Динамически формируем классы для строки
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

      {/* 2. Данные клиента */}
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

      <td>
        <OrderStatusInfo order={order} showStatusText={false} />
      </td>

      <td className={styles.priceCell} data-label="Сумма">
        <div className={styles.priceContainer}>
          {order.total_price} руб.
          {isOverdue && <AlertCircle size={16} color="#e11d48" />}
        </div>
      </td>

      {/* 3. Действия */}
      <td className={styles.actionsCell}>
        <button
          data-menu-trigger={order.id}
          className={styles.actionButton}
          onClick={() => onToggleMenu(order.id)}
        >
          <EllipsisVertical size={16} />
        </button>

        {isOpen && (
          <ActionsMenu
            id={order.id}
            type="order"
            currentStatus={order.status}
            onClose={() => onToggleMenu(order.id)}
            onStatusUpdate={onStatusUpdate}
            onDeleteClick={() => onDeleteClick(order.id)}
          />
        )}
      </td>
    </tr>
  );
}
