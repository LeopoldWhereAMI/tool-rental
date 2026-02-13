import { OrderUI } from "@/types";
import styles from "../page.module.css";
import OrderItem from "./OrderItem";

interface OrdersListProps {
  viewMode: "table" | "grid";
  orders: OrderUI[];
  openMenuId: string | null;
  anchor: { top: number; left: number } | null;
  onToggleMenu: (e: React.MouseEvent<HTMLElement>, id: string) => void;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
}
export default function OrdersList({
  viewMode,
  orders,
  openMenuId,
  anchor,
  onToggleMenu,
  onClose,
  onStatusUpdate,
  onDeleteClick,
}: OrdersListProps) {
  const wrapperClass = `${styles.tableWrapper} ${viewMode === "grid" ? styles.forceGrid : ""}`;

  return (
    <div className={wrapperClass}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Заказ</th>
            {/* <th>Статус</th> */}
            <th>Клиент</th>
            {/* <th>Телефон</th> */}
            <th className={styles.toolListCell}>Инструмент</th>
            <th>Статус проката</th>
            <th className={styles.priceCell}>Сумма</th>
            <th className={styles.actionsCell} />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              isOpen={openMenuId === order.id}
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
