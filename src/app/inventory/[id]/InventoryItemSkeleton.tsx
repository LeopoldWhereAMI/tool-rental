import Skeleton from "@/components/ui/Skeleton/Skeleton";
import BackButton from "@/components/BackButton/BackButton";
import PageWrapper from "@/components/PageWrapper/PageWrapper"; // Импортируем обертку
import styles from "./page.module.css";

export default function InventoryItemSkeleton() {
  return (
    <PageWrapper>
      <div className={styles.container}>
        <header className={styles.header}>
          <BackButton href="/inventory">Назад к инвентарю</BackButton>
          <Skeleton width={140} height={40} borderRadius="8px" />
        </header>

        <div className={styles.mainGrid}>
          {/* Левая колонка */}
          <aside className={styles.leftCol}>
            <div className={styles.card}>
              <Skeleton width="100%" height={300} borderRadius="12px" />
            </div>

            <div className={`${styles.card} ${styles.quickStats}`}>
              <div className={styles.skeletonStatsGroup}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={styles.skeletonStatRow}>
                    <Skeleton width="40%" height={16} />
                    <Skeleton width="30%" height={16} />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Правая колонка */}
          <main className={styles.rightCol}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <Skeleton width="180px" height={24} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.skeletonDetailsList}>
                  {[1, 2, 3, 4, 6].map((i) => (
                    <Skeleton key={i} width="100%" height={24} />
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </PageWrapper>
  );
}
