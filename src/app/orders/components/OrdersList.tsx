import { OrderUI } from "@/types";
import styles from "../page.module.css";
import OrderItem from "./OrderItem";

interface OrdersListProps {
  orders: OrderUI[];
  openMenuId: string | null;
  onToggleMenu: (id: string) => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
}
export default function OrdersList({
  orders,
  openMenuId,
  onToggleMenu,
  onStatusUpdate,
  onDeleteClick,
}: OrdersListProps) {
  return (
    <div className={styles.tableWrapper}>
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
              onToggleMenu={onToggleMenu}
              onStatusUpdate={onStatusUpdate}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
