"use client";

import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "./page.module.css";

export default function ClientsPageSkeleton() {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Имя клиента</th>
            <th>Контактные данные</th>
            <th>Заказы</th>
            <th>Статус</th>
            <th>Лояльность</th>
            <th style={{ width: "80px" }}></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(6)].map((_, i) => (
            <tr key={i} className={styles.row}>
              <td>
                <div className={styles.nameCell}>
                  <Skeleton width="40px" height="40px" borderRadius="50%" />
                  <div className={styles.nameInfo}>
                    <Skeleton
                      width="120px"
                      height="16px"
                      style={{ marginBottom: "6px" }}
                    />
                    <Skeleton width="80px" height="12px" />
                  </div>
                </div>
              </td>
              <td>
                <Skeleton width="130px" height="16px" />
              </td>
              <td>
                <div className={styles.ordersCell}>
                  <Skeleton
                    width="60px"
                    height="14px"
                    style={{ marginBottom: "4px" }}
                  />
                  <Skeleton width="40px" height="12px" />
                </div>
              </td>
              <td>
                <Skeleton width="80px" height="24px" borderRadius="12px" />
              </td>
              <td>
                <Skeleton width="100px" height="24px" borderRadius="12px" />
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end",
                  }}
                >
                  <Skeleton width="32px" height="32px" borderRadius="6px" />
                  <Skeleton width="32px" height="32px" borderRadius="6px" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
