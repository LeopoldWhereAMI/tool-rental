"use client";

import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "./page.module.css";

export default function ClientDetailsSkeleton() {
  return (
    <div className={styles.wrapper}>
      {/* 1. Хлебные крошки */}
      <div className={styles.headerWrapper}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Skeleton width="60px" height="14px" />
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <Skeleton width="140px" height="14px" />
        </div>
      </div>

      <div className={styles.container}>
        <main className={styles.mainContent}>
          {/* 2. Активные аренды */}
          <section className={styles.sectionBlock}>
            <div
              className={styles.sectionHeader}
              style={{ marginBottom: "20px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Skeleton width="20px" height="20px" borderRadius="4px" />
                <Skeleton width="180px" height="24px" />
              </div>
              <Skeleton width="100px" height="26px" borderRadius="13px" />
            </div>

            <div className={styles.activeGrid}>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={styles.activeCard}
                  style={{ pointerEvents: "none" }}
                >
                  <div className={styles.activeCardContent}>
                    <div className={styles.activeCardMain}>
                      {/* Иконка в боксе */}
                      <div
                        className={styles.toolIconBox}
                        style={{
                          border: "none",
                          backgroundColor: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <Skeleton
                          width="22px"
                          height="22px"
                          borderRadius="4px"
                        />
                      </div>
                      <div className={styles.activeCardText}>
                        <Skeleton width="100px" height="16px" />
                      </div>
                    </div>
                    <Skeleton width="90px" height="26px" borderRadius="13px" />
                  </div>
                  <div className={styles.activeCardDetails}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Skeleton width="14px" height="14px" borderRadius="2px" />
                      <Skeleton width="120px" height="14px" />
                    </div>
                    <Skeleton width="70px" height="20px" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. История заказов */}
          <section className={styles.sectionBlock}>
            <div
              className={styles.historyHeader}
              style={{ marginBottom: "20px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Skeleton width="20px" height="20px" borderRadius="4px" />
                <Skeleton width="160px" height="24px" />
              </div>
              <Skeleton width="240px" height="40px" borderRadius="10px" />
            </div>

            <div className={styles.ordersList}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={styles.listCard}
                  style={{ pointerEvents: "none" }}
                >
                  <div className={styles.colId}>
                    <Skeleton width="50px" height="18px" />
                  </div>
                  <div className={styles.colDate}>
                    <Skeleton width="160px" height="16px" />
                  </div>
                  <div className={styles.colPrice}>
                    <Skeleton width="70px" height="18px" />
                  </div>
                  <div className={styles.colStatus}>
                    <Skeleton width="95px" height="26px" borderRadius="13px" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* 4. Сайдбар */}
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <Skeleton width="64px" height="64px" borderRadius="50%" />
              <div className={styles.profileTexts}>
                <Skeleton
                  width="140px"
                  height="22px"
                  style={{ marginBottom: "6px" }}
                />
                <Skeleton width="100px" height="14px" />
              </div>
            </div>

            <div className={styles.contactList} style={{ marginTop: "24px" }}>
              <div
                style={{ display: "flex", gap: "12px", marginBottom: "16px" }}
              >
                <Skeleton width="16px" height="16px" borderRadius="4px" />
                <Skeleton width="120px" height="16px" />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <Skeleton width="16px" height="16px" borderRadius="4px" />
                <Skeleton width="180px" height="16px" />
              </div>
            </div>
          </div>

          <div className={styles.insightsCard}>
            <Skeleton
              width="100px"
              height="20px"
              style={{ marginBottom: "20px" }}
            />
            <div className={styles.statsRow}>
              <div className={styles.miniStat}>
                <Skeleton
                  width="60px"
                  height="12px"
                  style={{ marginBottom: "8px" }}
                />
                <Skeleton width="80px" height="22px" />
              </div>
              <div className={styles.miniStat}>
                <Skeleton
                  width="60px"
                  height="12px"
                  style={{ marginBottom: "8px" }}
                />
                <Skeleton width="40px" height="22px" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
