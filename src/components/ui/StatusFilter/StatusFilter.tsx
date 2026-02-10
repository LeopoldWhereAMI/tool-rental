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

  return (
    <div className={styles.filters}>
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
