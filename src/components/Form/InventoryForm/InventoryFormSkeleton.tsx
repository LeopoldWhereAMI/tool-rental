import Skeleton from "@/components/ui/Skeleton/Skeleton";
import PageContainer from "@/components/PageContainer/PageContainer";
import styles from "../../../app/inventory/[id]/edit/page.module.css";

export default function InventoryFormSkeleton() {
  // Общий стиль для имитации карточек формы на основе твоих переменных
  const cardStyle = {
    padding: "24px",
    background: "var(--surface)",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    boxShadow: "var(--table-shadow)",
  };

  return (
    <PageContainer>
      {/* Хедер скелетона — полностью по твоим стилям */}
      <header className={styles.header}>
        <div style={{ marginBottom: "16px" }}>
          <Skeleton width={200} height={20} />
        </div>
        <div className={styles.headerWrapper}>
          <div className={styles.titleGroup}>
            <Skeleton width={320} height={28} style={{ marginBottom: "8px" }} />
            <Skeleton width={240} height={14} />
          </div>
          <div className={styles.headerActions}>
            <Skeleton width={100} height={42} borderRadius="10px" />
            <Skeleton width={130} height={42} borderRadius="8px" />
          </div>
        </div>
      </header>

      {/* Контентная часть — две колонки */}
      <div className={styles.contentBody}>
        {/* Левая колонка — Галерея (flex: 0 0 300px) */}
        <aside className={styles.leftColumn}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Skeleton width="100%" height={300} borderRadius="12px" />
            <div style={{ display: "flex", gap: "12px" }}>
              <Skeleton width={88} height={88} borderRadius="8px" />
              <Skeleton width={88} height={88} borderRadius="8px" />
            </div>
          </div>
        </aside>

        {/* Правая колонка — Форма (flex: 1) */}
        <main className={styles.rightColumn}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Секция 1: Основная информация */}
            <div style={cardStyle}>
              <Skeleton
                width={180}
                height={22}
                style={{ marginBottom: "24px" }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <Skeleton width="100%" height={45} borderRadius="8px" />
                <Skeleton width="100%" height={45} borderRadius="8px" />
              </div>
              <Skeleton width="100%" height={45} borderRadius="8px" />
            </div>

            {/* Секция 2: Данные об учете */}
            <div style={cardStyle}>
              <Skeleton
                width={140}
                height={22}
                style={{ marginBottom: "24px" }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "20px",
                }}
              >
                <Skeleton width="100%" height={45} borderRadius="8px" />
                <Skeleton width="100%" height={45} borderRadius="8px" />
                <Skeleton width="100%" height={45} borderRadius="8px" />
              </div>
            </div>

            {/* Секция 3: Примечания */}
            <div style={cardStyle}>
              <Skeleton
                width={110}
                height={22}
                style={{ marginBottom: "24px" }}
              />
              <Skeleton width="100%" height={120} borderRadius="8px" />
            </div>
          </div>
        </main>
      </div>
    </PageContainer>
  );
}
