"use client";

import { useItemHistory } from "@/hooks/useItemHistory";
import { Clock, User, ExternalLink } from "lucide-react";
import Link from "next/link";
import styles from "./ItemRentalHistory.module.css";

interface ItemRentalHistoryProps {
  itemId: string;
}

export default function ItemRentalHistory({ itemId }: ItemRentalHistoryProps) {
  const { rentals, loading } = useItemHistory(itemId);

  if (loading) {
    return (
      <div className={styles.card}>
        <p className={styles.loadingText}>Загрузка истории...</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <Clock size={18} className={styles.iconPrimary} />
          История аренды
        </h3>
      </div>

      <div className={styles.cardContent}>
        {rentals && rentals.length > 0 ? (
          <div className={styles.historyList}>
            {rentals.map((rental) => (
              <div key={rental.id} className={styles.historyItem}>
                <div className={styles.historyMain}>
                  <div className={styles.clientInfo}>
                    <User size={14} className={styles.iconSecondary} />
                    {/* ОБНОВЛЕНО: Используем плоское поле client_name */}
                    <span>{rental.client_name}</span>
                  </div>
                  <span className={styles.historyPrice}>
                    {rental.total_price?.toLocaleString()} ₽
                  </span>
                </div>

                <div className={styles.historyMeta}>
                  <span className={styles.historyDates}>
                    {new Date(rental.start_date).toLocaleDateString("ru-RU")} —{" "}
                    {new Date(rental.end_date).toLocaleDateString("ru-RU")}
                  </span>
                </div>

                <div className={styles.historyActions}>
                  <span
                    className={`${styles.miniStatus} ${
                      rental.status
                        ? styles[rental.status as keyof typeof styles]
                        : ""
                    }`}
                  >
                    {rental.status === "completed" ? "Завершено" : "В работе"}
                  </span>
                  <Link
                    href={`/orders/${rental.order_id}`}
                    className={styles.detailsLink}
                  >
                    Детали <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>История аренды пуста</p>
          </div>
        )}
      </div>
    </div>
  );
}
