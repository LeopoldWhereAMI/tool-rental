import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "./page.module.css";

export default function OrderDetailsSkeleton() {
  return (
    <div className={styles.pageContainer}>
      {/* 1. Навигация: имитируем хлебные крошки и кнопку печати */}
      <div className={styles.topNav}>
        <div className={styles.navLeft}>
          <Skeleton width={180} height={24} borderRadius="4px" />
        </div>
        <div className={styles.navActions}>
          <Skeleton width={140} height={40} borderRadius="8px" />
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.contentArea}>
          {/* 2. Имитируем Hero-секцию (самый частый кейс) */}
          <section className={styles.heroSection}>
            <div className={styles.heroImageWrapper}>
              {/* Передаем className, чтобы размеры совпали с CSS картинки */}
              <Skeleton
                className={styles.heroImageContainer}
                borderRadius="12px"
              />
            </div>

            <div className={styles.heroDetails}>
              <div className={styles.heroTitleBlock}>
                <Skeleton width="80%" height={36} />
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <Skeleton width={100} height={20} borderRadius="10px" />
                  <Skeleton width={100} height={20} borderRadius="10px" />
                </div>
              </div>

              {/* Имитируем блок OrderPeriod */}
              <div style={{ marginTop: "24px" }}>
                <Skeleton width="100%" height={80} borderRadius="12px" />
              </div>

              <div className={styles.heroMeta} style={{ marginTop: "auto" }}>
                <Skeleton width={150} height={16} />
                <Skeleton width={120} height={32} borderRadius="6px" />
              </div>
            </div>
          </section>

          {/* 3. Таймлайн статуса */}
          <section className={styles.whiteBox} style={{ marginTop: 24 }}>
            <div className={styles.boxHeader}>
              <Skeleton width={200} height={24} />
            </div>
            <div style={{ padding: "20px 0" }}>
              <Skeleton width="100%" height={60} borderRadius="8px" />
            </div>
          </section>
        </div>

        {/* 4. Сайдбар */}
        <aside className={styles.sidebar}>
          {/* Карточка клиента */}
          <div className={styles.sidebarCard}>
            <Skeleton width="100%" height={120} borderRadius="12px" />
          </div>

          {/* Карточка финансов */}
          <div className={styles.sidebarCard} style={{ marginTop: 20 }}>
            <Skeleton width="100%" height={180} borderRadius="12px" />
          </div>

          {/* Дедлайн */}
          <div
            className={styles.deadlineBanner}
            style={{ marginTop: 20, border: "none" }}
          >
            <Skeleton width="100%" height={70} borderRadius="12px" />
          </div>
        </aside>
      </div>
    </div>
  );
}
