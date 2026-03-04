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
    <>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.pageInfo}>
            Страница <strong>{currentPage}</strong> из {totalPages}
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={`${styles.pageBtn} ${styles.pageBtnPrev}`}
              onClick={() => clickHandler(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className={`${styles.pageBtn} ${styles.pageBtnNext}`}
              onClick={() => clickHandler(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
