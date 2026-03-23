import styles from "./PaginationControls.module.css";

type PaginationControlsProps = {
  totalPages: number;
  currentPage: number;
  clickHandler: (page: number) => void;
};

export default function PaginationControls({
  totalPages,
  clickHandler,
  currentPage,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];

    const maxVisible = 3; // сколько кнопок показывать
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
    <div className={styles.pagination}>
      <div className={styles.pageInfo}>
        Стр <strong>{currentPage}</strong> из {totalPages}
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={styles.pageBtn}
          onClick={() => clickHandler(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Пред
        </button>

        {getPages().map((page, index) =>
          page === "..." ? (
            <span key={index} className={styles.dots}>
              ...
            </span>
          ) : (
            <button
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
          className={styles.pageBtn}
          onClick={() => clickHandler(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          След
        </button>
      </div>
    </div>
  );
}
