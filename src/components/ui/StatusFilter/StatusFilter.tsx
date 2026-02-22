import { useEffect, useRef } from "react";
import styles from "./StatusFilter.module.css";

type StatusFilterProps = {
  currentFilter: string;
  onFilterChange: (status: string) => void;
  labels: Record<string, string>;
};

export default function StatusFilter({
  currentFilter,
  onFilterChange,
  labels,
}: StatusFilterProps) {
  const statuses = Object.keys(labels);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Мягкая подсказка пользователю о наличии скролла на мобилках
    el.scrollTo({ left: 40, behavior: "smooth" });
    const timer = setTimeout(() => {
      el.scrollTo({ left: 0, behavior: "smooth" });
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.filters} ref={ref}>
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => onFilterChange(status)}
          className={`
            ${styles.filterBtn} 
            ${currentFilter === status ? styles.activeFilter : ""}
          `}
        >
          {labels[status]}
        </button>
      ))}
    </div>
  );
}
