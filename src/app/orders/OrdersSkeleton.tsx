"use client";

import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "./page.module.css";
// Импортируем стили таблицы, если они в отдельном модуле
import tableStyles from "./components/OrdersTable/OrdersTable.module.css";

export default function OrdersSkeleton() {
  const rows = Array.from({ length: 5 });
  const skeletonBase = "#252d3d"; // Темный цвет для вашей темы

  return (
    <div
      className={tableStyles.wrapper}
      style={{
        background: "#161b26",
        borderRadius: "12px",
        border: "1px solid #1f2633",
      }}
    >
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th style={{ width: "80px" }}>№</th>
            <th>Инструменты</th>
            <th>Клиент</th>
            <th>Период</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th style={{ width: "80px" }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #1f2633" }}>
              <td>
                <Skeleton
                  width="40px"
                  height="18px"
                  style={{ backgroundColor: skeletonBase }}
                />
              </td>
              <td>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Skeleton
                    width="10px"
                    height="10px"
                    borderRadius="50%"
                    style={{ backgroundColor: "#3b82f6", opacity: 0.4 }}
                  />
                  <Skeleton
                    width="160px"
                    height="16px"
                    style={{ backgroundColor: skeletonBase }}
                  />
                </div>
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <Skeleton
                    width="130px"
                    height="16px"
                    style={{ backgroundColor: skeletonBase }}
                  />
                  <Skeleton
                    width="90px"
                    height="12px"
                    style={{ backgroundColor: skeletonBase, opacity: 0.5 }}
                  />
                </div>
              </td>
              <td>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Skeleton
                    width="36px"
                    height="36px"
                    borderRadius="8px"
                    style={{ backgroundColor: skeletonBase }}
                  />
                  <Skeleton
                    width="12px"
                    height="2px"
                    style={{ backgroundColor: skeletonBase }}
                  />
                  <Skeleton
                    width="36px"
                    height="36px"
                    borderRadius="8px"
                    style={{ backgroundColor: skeletonBase }}
                  />
                </div>
              </td>
              <td>
                <Skeleton
                  width="60px"
                  height="18px"
                  style={{ backgroundColor: skeletonBase }}
                />
              </td>
              <td>
                <Skeleton
                  width="100px"
                  height="28px"
                  borderRadius="14px"
                  style={{ backgroundColor: skeletonBase, opacity: 0.6 }}
                />
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end",
                  }}
                >
                  <Skeleton
                    width="24px"
                    height="24px"
                    borderRadius="4px"
                    style={{ backgroundColor: skeletonBase }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
