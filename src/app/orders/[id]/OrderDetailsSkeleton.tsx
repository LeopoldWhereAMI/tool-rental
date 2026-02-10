import Skeleton from "@/components/ui/Skeleton/Skeleton";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import BackButton from "@/components/BackButton/BackButton";
import styles from "./page.module.css";

export default function OrderDetailsSkeleton() {
  return (
    <PageWrapper>
      <div className={styles.topNav}>
        <BackButton>Назад к списку</BackButton>
        <Skeleton width={160} height={40} borderRadius="8px" />
      </div>

      <div className={styles.container}>
        <div className={styles.mainCard}>
          <header className={styles.header}>
            <div className={styles.titleInfo}>
              <Skeleton width={200} height={32} />
              <Skeleton width={100} height={24} borderRadius="12px" />
            </div>
            <div className={styles.dateInfo}>
              <Skeleton width={150} height={18} />
            </div>
          </header>

          <div className={styles.infoGrid}>
            {/* Блоки имитируют OrderClientInfo, OrderPeriod и т.д. */}
            <div className={styles.section}>
              <div className={styles.skeletonLabel}>
                <Skeleton width={120} height={20} />
              </div>
              <Skeleton width="100%" height={60} />
            </div>

            <div className={styles.section}>
              <div className={styles.skeletonLabel}>
                <Skeleton width={120} height={20} />
              </div>
              <Skeleton width="100%" height={40} />
            </div>

            <div className={`${styles.section} ${styles.fullWidth}`}>
              <div className={styles.skeletonLabel}>
                <Skeleton width={150} height={20} />
              </div>
              <div className={styles.skeletonList}>
                <Skeleton width="100%" height={52} />
                <Skeleton width="100%" height={52} />
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.skeletonLabel}>
                <Skeleton width={100} height={20} />
              </div>
              <Skeleton width={180} height={40} />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
