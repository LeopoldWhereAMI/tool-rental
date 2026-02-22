import { OrderUI } from "@/types";
import styles from "../page.module.css";
import OrderItem from "./OrderItem";

interface OrdersListProps {
  orders: OrderUI[];
  openMenuId: string | null;
  anchor: { top: number; left: number } | null;
  onToggleMenu: (e: React.MouseEvent<HTMLElement>, id: string) => void;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
}
export default function OrdersList({
  orders,
  openMenuId,
  anchor,
  onToggleMenu,
  onClose,
  onStatusUpdate,
  onDeleteClick,
}: OrdersListProps) {
  return (
    <div className={styles.ordersGrid}>
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
    </div>
  );
}
