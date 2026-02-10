"use client";

import PageWrapper from "@/components/PageWrapper/PageWrapper";
import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "./page.module.css";

export default function ClientDetailsSkeleton() {
  return (
    <PageWrapper>
      {/* Имитация BackButton */}
      <div style={{ marginBottom: "20px" }}>
        <Skeleton width="150px" height="36px" borderRadius="8px" />
      </div>

      <div className={styles.container}>
        {/* Левая колонка — повторяем структуру .sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.profileCard}>
            {/* Аватар */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Skeleton width="80px" height="80px" borderRadius="50%" />
            </div>

            {/* Имя и Отчество */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <Skeleton width="80%" height="32px" />
              <Skeleton width="60%" height="20px" />
            </div>

            {/* Телефон */}
            <Skeleton width="100%" height="24px" />
          </div>

          {/* Статистика */}
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <Skeleton width="100%" height="40px" />
            </div>
            <div className={styles.statBox}>
              <Skeleton width="100%" height="40px" />
            </div>
          </div>
        </div>

        {/* Правая колонка — повторяем структуру .content */}
        <div className={styles.content}>
          <div className={styles.historyHeader}>
            <Skeleton width="200px" height="28px" />
            <Skeleton width="180px" height="36px" borderRadius="8px" />
          </div>

          <div className={styles.ordersList}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={styles.orderCard}
                style={{ cursor: "default", border: "1px solid #f1f5f9" }}
              >
                <div className={styles.orderMain}>
                  {/* Иконка заказа */}
                  <Skeleton width="36px" height="36px" borderRadius="8px" />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <Skeleton width="120px" height="18px" />
                    <Skeleton width="150px" height="14px" />
                  </div>
                </div>
                <div className={styles.orderMeta}>
                  {/* Статус и цена */}
                  <Skeleton width="80px" height="24px" borderRadius="20px" />
                  <Skeleton width="60px" height="20px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
