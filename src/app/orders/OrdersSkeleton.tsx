import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "./page.module.css";

export default function OrdersSkeleton() {
  const rows = Array.from({ length: 5 }); // Имитируем 5 строк

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: "10%" }}>№</th>
            <th style={{ width: "25%" }}>Клиент</th>
            <th style={{ width: "20%" }}>Инструменты</th>
            <th style={{ width: "15%" }}>Дата</th>
            <th style={{ width: "15%" }}>Статус</th>
            <th style={{ width: "10%" }}>Сумма</th>
            <th style={{ width: "50px" }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, index) => (
            <tr key={index}>
              <td>
                <Skeleton width="40px" height={20} />
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <Skeleton width="80%" height={18} />
                  <Skeleton width="50%" height={14} />
                </div>
              </td>
              <td>
                <Skeleton width="90%" height={20} />
              </td>
              <td>
                <Skeleton width="70%" height={20} />
              </td>
              <td>
                <Skeleton width="100px" height={26} borderRadius="13px" />
              </td>
              <td>
                <Skeleton width="60px" height={20} />
              </td>
              <td>
                <Skeleton width={20} height={20} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
