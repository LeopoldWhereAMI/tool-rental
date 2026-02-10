import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "../page.module.css";

export default function InventorySkeleton() {
  const rows = Array.from({ length: 5 });

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {/* Заголовки можно оставить статичными или тоже заскелетонить */}
            <th style={{ width: "10%" }}>Артикул</th>
            <th style={{ width: "30%" }}>Наименование</th>
            <th style={{ width: "15%" }}>Категория</th>
            <th style={{ width: "15%" }}>Статус</th>
            <th style={{ width: "15%" }}>Цена</th>
            <th style={{ width: "50px" }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, index) => (
            <tr key={index}>
              <td>
                <Skeleton width="60%" height={20} />
              </td>
              <td>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Skeleton width={24} height={24} borderRadius="50%" />
                  <Skeleton width="80%" height={20} />
                </div>
              </td>
              <td>
                <Skeleton width="70%" height={20} />
              </td>
              <td>
                <Skeleton width="100px" height={24} borderRadius="12px" />
              </td>
              <td>
                <Skeleton width="50px" height={20} />
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
