import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "./page.module.css";

export default function AnalyticsSkeleton() {
  const cards = Array.from({ length: 3 });

  return (
    <div className={styles.statsGrid}>
      {cards.map((_, index) => (
        <div key={index} className={styles.statCard}>
          <div
            className={styles.iconWrapper}
            style={{ backgroundColor: "#f1f5f9" }}
          >
            {/* Скелетон для иконки */}
            <Skeleton width={24} height={24} borderRadius="50%" />
          </div>
          <div className={styles.statInfo}>
            {/* Скелетон для подписи (Выручка/Заказы) */}
            <Skeleton width="100px" height={14} />
            {/* Скелетон для большого числа */}
            <Skeleton width="140px" height={28} />
          </div>
        </div>
      ))}
    </div>
  );
}
