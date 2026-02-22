import { ListFilter, X } from "lucide-react";
import styles from "./InventoryFilters.module.css";
import { validateCategory } from "@/helpers";
import { Dispatch, SetStateAction } from "react";

interface InventoryFiltersProps {
  categoryFilter: string;
  setCategoryFilter: Dispatch<SetStateAction<string>>;
  categories: string[];
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
}

export default function InventoryFilters({
  categoryFilter,
  setCategoryFilter,
  categories,
  statusFilter,
  setStatusFilter,
}: InventoryFiltersProps) {
  const hasFilters = categoryFilter !== "all" || statusFilter !== "all";

  // Функция сброса
  const onReset = () => {
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterLabel}>
        <ListFilter size={16} strokeWidth={1.5} /> Фильтры
      </div>
      <select
        className={styles.select}
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="all">Все категории</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {validateCategory(c)}
          </option>
        ))}
      </select>
      <select
        className={styles.select}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">Все статусы</option>
        <option value="available">Свободен</option>
        <option value="rented">В аренде</option>
        <option value="maintenance">На ремонте</option>
      </select>

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
