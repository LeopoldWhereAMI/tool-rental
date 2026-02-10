import BackButton from "@/components/BackButton/BackButton";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "./Form.module.css";

export default function InventoryFormSkeleton() {
  return (
    <PageWrapper>
      <BackButton>Назад</BackButton>
      {/* Используем тот же класс, что и у реальной формы */}
      <div className={styles.addInventoryForm}>
        <div className={styles.skeletonTitle}>
          {/* Имитируем заголовок h1 с его нижней границей */}
          <Skeleton width="100%" height={32} />
        </div>

        <div className={styles.row}>
          <Skeleton width="100%" height={60} borderRadius="8px" />
          <Skeleton width="100%" height={60} borderRadius="8px" />
        </div>

        <div className={styles.row}>
          <Skeleton width="100%" height={60} borderRadius="8px" />
          <Skeleton width="100%" height={60} borderRadius="8px" />
          <Skeleton width="100%" height={60} borderRadius="8px" />
        </div>

        <div className={styles.skeletonTextarea}>
          <Skeleton width="100%" height={120} borderRadius="8px" />
        </div>

        {/* Кнопка сохранения */}
        <div className={styles.skeletonButton}>
          <Skeleton width="220px" height={48} borderRadius="8px" />
        </div>
      </div>
    </PageWrapper>
  );
}
