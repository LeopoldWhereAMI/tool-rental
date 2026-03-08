"use client";

import styles from "../page.module.css";
import { OrderDetailsUI } from "@/types";
import { OrderItemRow } from "./OrderItemRow";

type OrderItemsListProps = {
  items: OrderDetailsUI["order_items"];
  orderStatus: string;
};

export default function OrderItemsList({
  items,
  orderStatus,
}: OrderItemsListProps) {
  return (
    <div className={styles.toolsListDetailed}>
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <OrderItemRow
            key={item.id || index}
            item={item}
            orderStatus={orderStatus}
          />
        ))
      ) : (
        <p className={styles.emptyText}>Инструменты не найдены</p>
      )}
    </div>
  );
}
