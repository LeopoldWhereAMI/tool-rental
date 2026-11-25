"use client";

import styles from "./OrdersTable.module.css";
import { OrderUI, ViewMode } from "@/types";
import OrderRow from "./OrderRow";
import OrderCard from "../OrderCard/OrderCard";
import EmptyBlock from "@/components/ui/EmptyBlock/EmptyBlock";
import Spinner from "@/components/ui/Spinner/Spinner";

interface OrdersTableProps {
  orders: OrderUI[];
  loading: boolean;
  openMenuId: string | null;
  anchor: { top: number; left: number } | null;
  onToggleMenu: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDeleteClick: (id: string) => void;
  viewMode: ViewMode;
}

export default function OrdersTable({
  orders,
  loading,
  viewMode,
  ...menuProps
}: OrdersTableProps) {
  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.wrapper}>
          {/* временно */}
          <div className={styles.loading}>
            <Spinner size={22} />
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return <EmptyBlock isSearch={true} message="Заказы не найдены" />;
  }

  const renderContent = () => {
    if (viewMode === "table") {
      return (
        <div className={styles.tableContainer}>
          <div className={styles.wrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>№</th>
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
                  <OrderRow key={order.id} order={order} {...menuProps} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.cardsContainer}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} {...menuProps} />
        ))}
      </div>
    );
  };

  return <div className={styles.mainWrapper}>{renderContent()}</div>;
}
