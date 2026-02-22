"use client";

import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "../page.module.css";

export default function InventorySkeleton() {
  const rows = Array.from({ length: 6 });

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Инструмент / ID</th>
            <th style={{ width: "15%", textAlign: "center" }}>Категория</th>
            <th style={{ width: "15%", textAlign: "center" }}>Статус</th>
            <th style={{ width: "15%" }}>Стоимость</th>
            <th style={{ width: "15%" }}>Наличие</th>
            <th style={{ width: "10%", textAlign: "right" }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, index) => (
            <tr key={index}>
              {/* Tool Name / ID */}
              <td>
                <div className={styles.productCell}>
                  <div className={styles.productImagePlaceholder}>
                    <Skeleton width="100%" height="100%" borderRadius="8px" />
                  </div>
                  <div className={styles.productInfo} style={{ gap: "6px" }}>
                    <Skeleton width="140px" height="16px" />
                    <Skeleton width="80px" height="12px" />
                  </div>
                </div>
              </td>

              {/* Category */}
              <td style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Skeleton width="80px" height="24px" borderRadius="12px" />
                </div>
              </td>

              {/* Status */}
              <td style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Skeleton width="90px" height="26px" borderRadius="13px" />
                </div>
              </td>

              {/* Price */}
              <td>
                <div className={styles.priceCell}>
                  <Skeleton width="60px" height="18px" />
                </div>
              </td>

              {/* Progress Bar (Availability) */}
              <td>
                <div
                  className={styles.availabilityWrapper}
                  style={{ gap: "8px" }}
                >
                  <Skeleton width="30px" height="14px" />
                  <Skeleton width="100%" height="6px" borderRadius="3px" />
                </div>
              </td>

              {/* Actions */}
              <td style={{ textAlign: "right" }}>
                <Skeleton width="32px" height="32px" borderRadius="50%" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
