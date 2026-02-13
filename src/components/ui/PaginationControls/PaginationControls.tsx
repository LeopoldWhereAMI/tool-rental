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
          <button
            className={styles.pageBtn}
            onClick={() => clickHandler(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Назад
          </button>

          <div className={styles.pageInfo}>
            <span>Страница</span> <strong>{currentPage}</strong>{" "}
            <span className={styles.hideOnMobile}>из {totalPages}</span>
          </div>

          <button
            className={styles.pageBtn}
            onClick={() => clickHandler(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Вперед
          </button>
        </div>
      )}
    </>
  );
}
