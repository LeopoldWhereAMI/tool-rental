"use client";

import { ListFilter, X } from "lucide-react";
import styles from "./ClientsFilters.module.css";
export type FilterStatus = "all" | "active" | "idle" | "blocked";
export type FilterLoyalty = "all" | "VIP" | "REGULAR" | "NEW";

interface ClientsFiltersProps {
  status: FilterStatus;
  loyalty: FilterLoyalty;
  onStatusChange: (status: FilterStatus) => void;
  onLoyaltyChange: (loyalty: FilterLoyalty) => void;
  onReset: () => void;
}

export default function ClientsFilters({
  status,
  loyalty,
  onStatusChange,
  onLoyaltyChange,
  onReset,
}: ClientsFiltersProps) {
  const hasFilters = status !== "all" || loyalty !== "all";

  return (
    <div className={styles.container}>
      <div className={styles.filterLabel}>
        <ListFilter size={16} strokeWidth={1.5} /> Фильтры
      </div>
      <div className={styles.selectGroup}>
        <select
          className={styles.select}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="idle">В ожидании</option>
          <option value="blocked">Черный список</option>
        </select>
      </div>

      <div className={styles.selectGroup}>
        <select
          className={styles.select}
          value={loyalty}
          onChange={(e) => onLoyaltyChange(e.target.value as FilterLoyalty)}
        >
          <option value="all">Любая лояльность</option>
          <option value="VIP">VIP клиенты</option>
          <option value="REGULAR">Постоянные</option>
          <option value="NEW">Новые</option>
        </select>
      </div>

      <div className={styles.resetWrapper}>
        {hasFilters && (
          <button
            className={styles.resetBtn}
            onClick={onReset}
            title="Сбросить все"
            disabled={!hasFilters}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
