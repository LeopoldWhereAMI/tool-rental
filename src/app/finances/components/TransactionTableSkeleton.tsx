import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "../page.module.css";

interface TransactionTableSkeletonProps {
  rows?: number;
}

export default function TransactionTableSkeleton({
  rows = 5,
}: TransactionTableSkeletonProps) {
  const skeletonRows = Array.from({ length: rows });

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th>ДАТА И ВРЕМЯ</th>
            <th>ОПИСАНИЕ</th>
            <th>ТИП</th>
            <th>СУММА</th>
            <th style={{ textAlign: "right" }}>ДЕЙСТВИЕ</th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, index) => (
            <tr key={`table-skeleton-${index}`} className={styles.tableRow}>
              {/* Дата и время */}
              <td className={styles.tableCell}>
                <div className={styles.dateBlock}>
                  <Skeleton width={90} height={16} />
                  <Skeleton
                    width={50}
                    height={12}
                    style={{ marginTop: "6px" }}
                  />
                </div>
              </td>

              {/* Описание */}
              <td className={styles.tableCell}>
                <div className={styles.descriptionBlock}>
                  <Skeleton width="70%" height={18} />
                </div>
              </td>

              {/* Тип (Badge) */}
              <td className={styles.tableCell}>
                <Skeleton width={75} height={24} borderRadius="20px" />
              </td>

              {/* Сумма */}
              <td className={styles.tableCell}>
                <Skeleton width={85} height={18} />
              </td>

              {/* Кнопка действия */}
              <td className={styles.tableCell} style={{ textAlign: "right" }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Skeleton width={32} height={32} borderRadius="8px" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
