// "use client";

// import styles from "../OrdersTable/OrdersTable.module.css";
// import { OrderUI } from "@/types";
// import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
// import Link from "next/link";
// import { EllipsisVertical, Eye } from "lucide-react";
// import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";

// interface OrderCardProps {
//   order: OrderUI;
//   openMenuId: string | null;
//   anchor: { top: number; left: number } | null;
//   onToggleMenu: (event: React.MouseEvent<HTMLElement>, id: string) => void;
//   onClose: () => void;
//   onStatusUpdate: (id: string, status: string) => Promise<void>;
//   onDeleteClick: (id: string) => void;
// }

// export default function OrderCard({
//   order,
//   openMenuId,
//   anchor,
//   onToggleMenu,
//   onClose,
//   onStatusUpdate,
//   onDeleteClick,
// }: OrderCardProps) {
//   const {
//     isOverdue,
//     isCompleted,
//     formattedStartDate,
//     formattedDate,
//     returnStatus,
//   } = useOrderStatusInfo(order);

//   const clientName = `${order.client.last_name} ${order.client.first_name}`;
//   const clientPhone = order.client.phone || "";

//   let statusClass = "";
//   let statusText = "";

//   if (order.status === "cancelled") {
//     statusClass = styles.badgeCancelled;
//     statusText = "Отменён";
//   } else if (isCompleted) {
//     statusClass = styles.badgeCompleted;
//     statusText = "Завершён";
//   } else if (isOverdue) {
//     statusClass = styles.badgeOverdue;
//     statusText = returnStatus?.text || "Просрочено";
//   } else if (returnStatus?.text) {
//     statusClass = `${styles.badgePending}`;
//     statusText = returnStatus.text;
//   }

//   return (
//     <div className={styles.card}>
//       <div className={styles.cardHeader}>
//         <div>
//           <div className={styles.cardOrderNumber}>#{order.order_number}</div>
//           <div className={styles.cardClientName}>{clientName}</div>
//           {clientPhone && (
//             <a href={`tel:${clientPhone}`} className={styles.cardClientPhone}>
//               {clientPhone}
//             </a>
//           )}
//         </div>
//         <div className={styles.cardActions}>
//           <Link href={`/orders/${order.id}`} className={styles.cardViewBtn}>
//             <Eye size={18} />
//           </Link>
//           <button
//             data-menu-trigger={order.id}
//             className={styles.cardMenuBtn}
//             onClick={(e) => onToggleMenu(e, order.id)}
//           >
//             <EllipsisVertical size={18} />
//           </button>
//           {openMenuId === order.id && (
//             <ActionsMenu
//               id={order.id}
//               type="order"
//               currentStatus={order.status}
//               onClose={onClose}
//               onDeleteClick={() => onDeleteClick(order.id)}
//               onStatusUpdate={onStatusUpdate}
//               anchor={anchor}
//             />
//           )}
//         </div>
//       </div>

//       <div className={styles.cardTools}>
//         {order.tools?.length
//           ? order.tools.map((t) => t.name).join(", ")
//           : order.inventory?.name}
//       </div>

//       <div className={styles.cardInfo}>
//         <div className={styles.cardInfoRow}>
//           <span className={styles.cardLabel}>Период:</span>
//           <span className={styles.cardValue}>
//             {formattedStartDate} → {formattedDate}
//           </span>
//         </div>
//         <div className={styles.cardInfoRow}>
//           <span className={styles.cardLabel}>Сумма:</span>
//           <span className={styles.cardPrice}>{order.total_price} ₽</span>
//         </div>
//       </div>

//       {statusText && (
//         <div className={`${styles.cardStatusBadge} ${statusClass}`}>
//           <span className={styles.statusDot}></span>
//           {statusText}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import styles from "../OrdersTable/OrdersTable.module.css";
import { OrderUI } from "@/types";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import Link from "next/link";
import { EllipsisVertical, Eye } from "lucide-react";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";

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
  const {
    isOverdue,
    isCompleted,
    formattedStartDate,
    formattedDate,
    returnStatus,
  } = useOrderStatusInfo(order);

  const clientName = `${order.client.last_name} ${order.client.first_name}`;
  const clientPhone = order.client.phone || "";

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
  } else if (returnStatus?.text) {
    statusClass = `${styles.badgePending}`;
    statusText = returnStatus.text;
  }

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.cardOrderInfo}>
          <div className={styles.cardOrderNumber}>#{order.order_number}</div>
          <div className={styles.cardClientName}>{clientName}</div>
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

      {/* Tools Section */}
      {(order.tools?.length || order.inventory?.name) && (
        <div className={styles.cardSection}>
          <span className={styles.cardSectionLabel}>Инструменты</span>
          <div className={styles.cardTools}>
            {order.tools?.length
              ? order.tools.map((t) => t.name).join(", ")
              : order.inventory?.name}
          </div>
        </div>
      )}

      {/* Period & Price Section */}
      <div className={styles.cardSection}>
        <span className={styles.cardSectionLabel}>Период и сумма</span>
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

      {/* Footer with Status */}
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
