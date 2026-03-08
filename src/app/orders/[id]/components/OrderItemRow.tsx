"use client";
import { Clock, ImageIcon } from "lucide-react";
import styles from "../page.module.css";
import { calculateDays, calculateItemTotal } from "@/helpers";
import { OrderItemDetailed, OrderUI } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";

interface OrderItemRowProps {
  item: OrderItemDetailed;
  orderStatus: string;
}

// Компонент для одной строки инструмента
export function OrderItemRow({ item, orderStatus }: OrderItemRowProps) {
  const itemAsOrder = {
    start_date: item.start_date,
    end_date: item.end_date,
    status: orderStatus,
  } as OrderUI;

  const { statusVariant, statusText } = useOrderStatusInfo(itemAsOrder);

  return (
    <Link
      href={`/inventory/${item.inventory?.id}`}
      title="Открыть"
      className={styles.toolCard}
    >
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

      <div className={styles.toolMainInfo}>
        <div className={styles.toolTitleRow}>
          <div className={styles.toolNameContainer}>
            <p className={styles.toolName}>
              {item.inventory?.name || "Инструмент"}
            </p>
            {statusVariant && (
              <span className={`${styles.badge} ${styles[statusVariant]}`}>
                {statusText}
              </span>
            )}
          </div>
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
                ({calculateDays(item.start_date, item.end_date)} дн.)
              </small>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
