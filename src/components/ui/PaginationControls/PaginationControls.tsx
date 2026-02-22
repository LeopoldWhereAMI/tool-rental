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
  // return (
  //   <>
  //     {totalPages > 1 && (
  //       <div className={styles.pagination}>
  //         <button
  //           className={styles.pageBtn}
  //           onClick={() => clickHandler(currentPage - 1)}
  //           disabled={currentPage === 1}
  //         >
  //           Назад
  //         </button>

  //         <div className={styles.pageInfo}>
  //           <span>Страница</span> <strong>{currentPage}</strong>{" "}
  //           <span className={styles.hideOnMobile}>из {totalPages}</span>
  //         </div>

  //         <button
  //           className={styles.pageBtn}
  //           onClick={() => clickHandler(currentPage + 1)}
  //           disabled={currentPage === totalPages}
  //         >
  //           Вперед
  //         </button>
  //       </div>
  //     )}
  //   </>
  // );

  return (
    <>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {/* Левая часть: информация о страницах (стилизована под образец) */}
          <div className={styles.pageInfo}>
            Страница <strong>{currentPage}</strong> из {totalPages}
            {/* Если будут пропсы, можно показывать как в образце:
                Showing {startItem}-{endItem} of {totalItems} results */}
          </div>

          {/* Правая часть: кнопки */}
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
