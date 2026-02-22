import { OrderUI } from "@/types";
import styles from "../page.module.css";
import { Settings } from "lucide-react";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import { validateOrderStatus } from "@/helpers";

type OrderItemProps = {
  order: OrderUI;
  isOpen: boolean;
  anchor: { top: number; left: number } | null;
  onToggleMenu: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
};

export default function OrderItem({
  order,
  isOpen,
  anchor,
  onToggleMenu,
  onClose,
  onStatusUpdate,
  onDeleteClick,
}: OrderItemProps) {
  const { isOverdue, returnStatus, hasValidDate, formattedDate, isActive } =
    useOrderStatusInfo(order);
  const statusInfo = validateOrderStatus(order.status);
  const statusClass = styles[statusInfo.className as keyof typeof styles] || "";
  // Собираем все инструменты в одну строку
  const toolsList =
    order.tools && order.tools.length > 0
      ? order.tools
      : order.inventory
        ? [order.inventory]
        : [];

  // Для картинки по-прежнему берем первый инструмент
  const mainTool = toolsList[0];
  const toolImage = mainTool?.image_url || "/placeholder-tool.png";

  return (
    <div className={styles.newCard}>
      <div className={styles.imageSection}>
        <img src={toolImage} alt="Tool" className={styles.cardImage} />
        <div className={`${styles.badgeActive} ${statusClass}`}>
          {statusInfo.text.toUpperCase()}
        </div>
        {isActive && hasValidDate && returnStatus?.text && (
          <div className={isOverdue ? styles.badgeOverdue : styles.badgeDue}>
            {returnStatus.text.toUpperCase()}
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <span className={styles.cardToolId}>№ {order.order_number}</span>

        {/* Отображаем все названия инструментов */}
        <div className={styles.cardTitleList}>
          {toolsList.map((tool, index) => (
            <h3 key={index} className={styles.cardTitleItem} title={tool.name}>
              {tool.name}
            </h3>
          ))}
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Дата возврата</span>

            <span className={isOverdue ? styles.priceValue : styles.value}>
              {formattedDate}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Сумма</span>
            <span className={styles.priceValue}>
              {new Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
                maximumFractionDigits: 0,
              }).format(order.total_price)}
            </span>
          </div>
        </div>

        <div className={styles.cardActions}>
          <button className={styles.manageBtn}>
            <Settings size={16} />
            Управление прокатом
          </button>

          <div className={styles.relative}>
            <button
              className={styles.dotsBtn}
              onClick={(e) => onToggleMenu(e, order.id)}
            >
              •••
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
          </div>
        </div>
      </div>
    </div>
  );
}
