import styles from "./PaginationControls.module.css";

type PaginationControlsProps = {
  totalPages: number;
  currentPage: number;
  clickHandler: React.Dispatch<React.SetStateAction<number>>;
};

export default function PaginationControls({
  totalPages,
  clickHandler,
  currentPage,
}: PaginationControlsProps) {
  return (
    <div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => clickHandler(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Назад
          </button>

          <span className={styles.pageInfo}>
            Страница <strong>{currentPage}</strong> из {totalPages}
          </span>

          <button
            className={styles.pageBtn}
            onClick={() => clickHandler(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
}
