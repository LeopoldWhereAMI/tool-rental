import Skeleton from "@/components/ui/Skeleton/Skeleton";
import PageContainer from "@/components/PageContainer/PageContainer";
import styles from "./page.module.css";

export default function InventoryItemSkeleton() {
  return (
    <PageContainer>
      <div className={styles.pageContainer}>
        {/* Хлебные крошки */}
        <div style={{ marginBottom: "20px" }}>
          <Skeleton width={250} height={20} />
        </div>

        {/* Заголовок и кнопки действий */}
        <div className={styles.headerSection}>
          <div className={styles.titleBlock}>
            <div className={styles.titleRow}>
              <Skeleton width={300} height={40} borderRadius="8px" />
              <Skeleton width={100} height={28} borderRadius="20px" />
            </div>
            <div className={styles.metaInfo} style={{ marginTop: "12px" }}>
              <Skeleton width={150} height={16} />
              <div style={{ width: "20px" }} />
              <Skeleton width={180} height={16} />
            </div>
          </div>

          <div className={styles.actionsBar}>
            <Skeleton width={140} height={42} borderRadius="8px" />
            <Skeleton width={160} height={42} borderRadius="8px" />
          </div>
        </div>

        {/* Основная сетка Dashboard */}
        <div className={styles.dashboardGrid}>
          {/* Колонка с фото */}
          <div className={styles.colGallery}>
            <div className={styles.heroImageContainer}>
              <Skeleton width="100%" height="100%" borderRadius="16px" />
            </div>
          </div>

          {/* Колонка с метриками (ROI, Загрузка, ТО) */}
          <div className={styles.colMetrics}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.metricCardSmall}>
                <div className={styles.metricHeader}>
                  <Skeleton width="60%" height={20} />
                  <Skeleton width={32} height={32} borderRadius="8px" />
                </div>
                <div
                  className={styles.metricContent}
                  style={{ marginTop: "15px" }}
                >
                  <Skeleton width="40%" height={36} />
                  <Skeleton
                    width="80%"
                    height={14}
                    style={{ marginTop: "10px" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Колонка с техническими данными */}
          <div className={styles.colDetails}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Skeleton width="50%" height={24} />
              </div>
              <div className={styles.cardContent}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Skeleton width="40%" height={18} />
                      <Skeleton width="30%" height={18} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Колонка с историей аренды */}
          <div className={styles.colHistory}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Skeleton width="40%" height={24} />
              </div>
              <div className={styles.cardContent}>
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    width="100%"
                    height={60}
                    borderRadius="10px"
                    style={{ marginBottom: "12px" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
