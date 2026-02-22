"use client";

import styles from "./OrdersTable.module.css";
import { OrderUI } from "@/types";
import OrderRow from "./OrderRow";

interface OrdersTableProps {
  orders: OrderUI[];
  openMenuId: string | null;
  anchor: { top: number; left: number } | null;
  onToggleMenu: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
}

export default function OrdersTable({
  orders,
  openMenuId,
  anchor,
  onToggleMenu,
  onClose,
  onStatusUpdate,
  onDeleteClick,
}: OrdersTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>№ </th>
            <th>Инструменты</th>
            <th>Клиент</th>
            <th>Период</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              openMenuId={openMenuId}
              anchor={anchor}
              onToggleMenu={onToggleMenu}
              onClose={onClose}
              onStatusUpdate={onStatusUpdate}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
