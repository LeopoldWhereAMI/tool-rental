import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./PaginationControls.module.css";

type PaginationControlsProps = {
  totalPages: number;
  currentPage: number;
  clickHandler: (page: number) => void;
  className?: string;
  compact?: boolean;
};

export default function PaginationControls({
  totalPages,
  clickHandler,
  currentPage,
  className,
  compact = false,
}: PaginationControlsProps) {
  const getPages = () => {
    if (compact) {
      if (totalPages <= 4) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages];
      }

      if (currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
      }

      return [1, "...", currentPage, "...", totalPages];
    }

    const pages: (number | string)[] = [];

    const maxVisible = 3;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) pages.push(1);
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <div
      className={`${styles.pagination} ${
        compact ? styles.compact : ""
      } ${className ?? ""}`}
    >
      <div className={styles.pageInfo}>
        Стр <strong>{currentPage}</strong> из {totalPages}
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.pageBtn}
          onClick={() => clickHandler(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>

        {getPages().map((page, index) =>
          page === "..." ? (
            <span key={index} className={styles.dots}>
              ...
            </span>
          ) : (
            <button
              type="button"
              key={index}
              onClick={() => clickHandler(Number(page))}
              className={`${styles.pageBtn} ${
                currentPage === page ? styles.active : ""
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.pageBtn}
          onClick={() => clickHandler(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
