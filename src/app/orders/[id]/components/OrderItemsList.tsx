"use client";
import { Clock, ImageIcon } from "lucide-react";
import styles from "../page.module.css";
import { calculateDays, calculateItemTotal } from "@/helpers";
import { OrderDetailsUI } from "@/types";
import Image from "next/image";

type OrderItemsListProps = {
  items: OrderDetailsUI["order_items"];
};

export default function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className={styles.rentedToolsSection}>
      <div className={styles.rentedToolsHeader}>
        <h2>Арендованные инструменты</h2>
        <span className={styles.itemCountBadge}>{items?.length || 0} поз.</span>
      </div>

      <div className={styles.toolsListDetailed}>
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <div key={item.id || index} className={styles.toolCard}>
              {/* Левая часть: Изображение */}
              <div className={styles.productImagePlaceholder}>
                {item.inventory?.image_url ? (
                  <Image
                    src={item.inventory.image_url}
                    alt={item.inventory.name || "Tool"}
                    fill
                    unoptimized
                    style={{ objectFit: "cover" }}
                    className={styles.productImage}
                    sizes="72px"
                  />
                ) : (
                  <ImageIcon size={28} color="#9ca3af" />
                )}
              </div>

              {/* Правая часть: Информация */}
              <div className={styles.toolMainInfo}>
                <div className={styles.toolTitleRow}>
                  <p className={styles.toolName}>
                    {item.inventory?.name || "Инструмент"}
                  </p>
                  <p className={styles.toolPriceLabel}>
                    {calculateItemTotal(
                      item.start_date,
                      item.end_date,
                      item.price_at_time,
                    )}{" "}
                    ₽
                  </p>
                </div>

                <div className={styles.toolMetaRow}>
                  <div className={styles.toolSubInfo}>
                    <span className={styles.badgeBlue}>
                      S/N: {item.inventory?.serial_number || "—"}
                    </span>
                    <span className={styles.badgeBlue}>
                      Арт: {item?.inventory?.article || "—"}
                    </span>
                  </div>

                  <div className={styles.toolTimeline}>
                    <Clock size={14} />
                    <span>
                      {new Date(item.start_date).toLocaleDateString()} -{" "}
                      {new Date(item.end_date).toLocaleDateString()}
                      <small className={styles.daysSmall}>
                        {" "}
                        ({calculateDays(item.start_date, item.end_date)} дн.)
                      </small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyText}>Инструменты не найдены</p>
        )}
      </div>
    </div>
  );
}
