"use client";

import styles from "../OrdersTable/OrdersTable.module.css";
import { OrderUI } from "@/types";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import Link from "next/link";
import { EllipsisVertical, Eye } from "lucide-react";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import ToolStatusDot from "../ToolStatusDot/ToolStatusDot";

interface OrderCardProps {
  order: OrderUI;
  openMenuId: string | null;
  anchor: { top: number; left: number } | null;
  onToggleMenu: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
}

export default function OrderCard({
  order,
  openMenuId,
  anchor,
  onToggleMenu,
  onClose,
  onStatusUpdate,
  onDeleteClick,
}: OrderCardProps) {
  const { statusText, statusVariant, formattedStartDate, formattedDate } =
    useOrderStatusInfo(order);

  const clientName = order.client.display_name;
  const clientPhone = order.client.phone || "";

  const statusClass = statusVariant
    ? styles[statusVariant as keyof typeof styles]
    : "";

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardOrderInfo}>
          <div className={styles.cardOrderNumber}>#{order.order_number}</div>
          <Link
            href={`/clients/${order.client.id}`}
            className={styles.cardClientLink}
          >
            <div className={styles.cardClientName}>{clientName}</div>
          </Link>
          {clientPhone && (
            <a href={`tel:${clientPhone}`} className={styles.cardClientPhone}>
              {clientPhone}
            </a>
          )}
        </div>

        <div className={styles.cardActions}>
          <Link href={`/orders/${order.id}`} className={styles.cardViewBtn}>
            <Eye size={18} />
          </Link>
          <button
            data-menu-trigger={order.id}
            className={styles.cardMenuBtn}
            onClick={(e) => onToggleMenu(e, order.id)}
          >
            <EllipsisVertical size={18} />
          </button>
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
        </div>
      </div>

      {(order.tools?.length || order.inventory?.name) && (
        <div className={styles.cardSection}>
          <span className={styles.cardSectionLabel}>Инструменты</span>
          <div className={styles.cardTools}>
            {(order.tools ?? []).length > 0 ? (
              order.tools!.map((t) => (
                <span key={t.id} className={styles.cardToolItem}>
                  <ToolStatusDot
                    endDate={t.end_date}
                    orderStatus={order.status}
                  />
                  <Link
                    href={`/inventory/${t.id}`}
                    className={styles.toolNameLink}
                  >
                    {t.name}
                  </Link>
                </span>
              ))
            ) : (
              <span className={styles.cardToolItem}>
                <ToolStatusDot
                  endDate={order.end_date}
                  orderStatus={order.status}
                />
                {order.inventory?.name ?? "Инструмент не указан"}
              </span>
            )}
          </div>
        </div>
      )}

      <div className={styles.cardSection}>
        <div className={styles.cardInfoRow}>
          <span className={styles.cardLabel}>Период:</span>
          <span className={styles.cardValue}>
            {formattedStartDate} → {formattedDate}
          </span>
        </div>
        <div className={styles.cardInfoRow}>
          <span className={styles.cardLabel}>Сумма:</span>
          <span className={styles.cardPrice}>{order.total_price} ₽</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        {statusText && (
          <div className={`${styles.cardStatusBadge} ${statusClass}`}>
            <span className={styles.statusDot}></span>
            {statusText}
          </div>
        )}
      </div>
    </div>
  );
}
