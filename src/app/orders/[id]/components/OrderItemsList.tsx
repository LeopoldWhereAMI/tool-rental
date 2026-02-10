import { Clock, ToolCase } from "lucide-react";
import styles from "../page.module.css";
import { calculateDays, calculateItemTotal } from "@/helpers";
import { OrderDetailsUI } from "@/types";

type OrderItemsListProps = {
  items: OrderDetailsUI["order_items"];
};

export default function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className={`${styles.infoBlock} ${styles.wideBlock}`}>
      <div className={styles.blockTitle}>
        <ToolCase size={20} /> <h3>Инструменты и индивидуальные сроки</h3>
      </div>
      <div className={styles.blockContent}>
        {items && items.length > 0 ? (
          <div className={styles.toolsListDetailed}>
            {items.map((item, index) => (
              <div key={item.id || index} className={styles.toolItemEntry}>
                <div className={styles.toolHeader}>
                  <p className={styles.name}>
                    • {item.inventory?.name || "Инструмент"}
                  </p>
                  <span className={styles.toolPrice}>
                    {calculateItemTotal(
                      item.start_date,
                      item.end_date,
                      item.price_at_time,
                    )}{" "}
                    ₽
                    <span className={styles.subText}>
                      ({calculateDays(item.start_date, item.end_date)} дн.)
                    </span>
                  </span>
                </div>

                <div className={styles.toolMeta}>
                  <span className={styles.subText}>
                    S/N: {item.inventory?.serial_number || "—"}
                  </span>

                  {/* Добавляем отображение дат для конкретного инструмента */}
                  <div className={styles.individualDates}>
                    <Clock size={14} />
                    <span>
                      {item.start_date
                        ? new Date(item.start_date).toLocaleDateString()
                        : "—"}
                      {" — "}
                      {item.end_date
                        ? new Date(item.end_date).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Инструменты не найдены</p>
        )}
      </div>
    </div>
  );
}
