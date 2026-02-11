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

    el.scrollTo({ left: 80, behavior: "smooth" });
    setTimeout(() => {
      el.scrollTo({ left: 0, behavior: "smooth" });
    }, 600);
  }, []);

  return (
    <div className={styles.filters} ref={ref}>
      {statuses.map((status) => {
        const isActive = currentFilter === status;

        const colorClass = styles[`status_${status}`] || "";

        return (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className={`
              ${styles.filterBtn} 
              ${isActive ? styles.activeFilter : ""} 
              ${isActive ? colorClass : ""}
            `}
          >
            {labels[status]}
          </button>
        );
      })}
    </div>
  );
}
