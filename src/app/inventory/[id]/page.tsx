"use client";

import PageWrapper from "@/components/PageWrapper/PageWrapper";
import { useInventoryItem } from "@/hooks/useInventoryItem";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import BackButton from "@/components/BackButton/BackButton";
import ItemDetailsList from "@/components/Inventory/ItemDetailsList/ItemDetailsList";
import ItemGallery from "@/components/Inventory/ItemGallery/ItemGallery";
import { calculateDaysInWork, validateStatus } from "@/helpers";

// export default function InventoryItemPage() {
//   const params = useParams();
//   const id = params.id as string;
//   const { item, loading, error, mutate } = useInventoryItem(id);

//   if (loading) return <div>Загрузка...</div>;
//   if (error) return <div>Ошибка: {error}</div>;
//   if (!item) return <div>Инструмент не найден</div>;

//   return (
//     <div className={styles.InventoryItemPage}>
//       <PageWrapper>
//         <header className={styles.header}>
//           <BackButton>Назад</BackButton>
//           <Link href={`/inventory/edit/${id}`} className={styles.editBtn}>
//             Редактировать
//           </Link>
//         </header>
//       </PageWrapper>
//       <div className={styles.columnsBlock}>
//         <PageWrapper>
//           <ItemGallery id={id} imageUrl={item.image_url} onMutate={mutate} />
//         </PageWrapper>
//         <PageWrapper>
//           <section>
//             <h2>Подробная информация</h2>
//             <ItemDetailsList item={item} />
//           </section>
//         </PageWrapper>
//         <PageWrapper>
//           <section>
//             <h2>Информация об аренде</h2>
//           </section>
//         </PageWrapper>
//       </div>
//     </div>
//   );
// }

export default function InventoryItemPage() {
  const params = useParams();
  const id = params.id as string;
  const { item, loading, error, mutate } = useInventoryItem(id);

  if (loading) return <div className={styles.center}>Загрузка...</div>;
  if (error) return <div className={styles.center}>Ошибка: {error}</div>;
  if (!item) return <div className={styles.center}>Инструмент не найден</div>;

  return (
    <PageWrapper>
      <div className={styles.container}>
        {/* Верхняя панель навигации */}
        <header className={styles.header}>
          <BackButton fallback="/inventory">Назад к инвентарю</BackButton>
          <Link href={`/inventory/edit/${id}`} className={styles.editBtn}>
            Редактировать
          </Link>
        </header>

        <div className={styles.mainGrid}>
          {/* Левая колонка: Визуал */}
          <aside className={styles.leftCol}>
            {/* <div className={styles.card}> */}
            <ItemGallery id={id} imageUrl={item.image_url} onMutate={mutate} />
            {/* </div> */}

            {/* Быстрая сводка под фото */}
            {/* <div className={`${styles.card} ${styles.quickStats}`}>
              <h2>Быстрая сводка</h2>
              <div className={styles.stat}>
                <span>Статус</span>
                <span className={styles.statusBadge}>
                  {item.status && validateStatus(item.status)}
                </span>
              </div>
              <div className={styles.stat}>
                <span>Артикул</span>
                <strong>{item.article}</strong>
              </div>
            </div> */}

            <div className={`${styles.card} ${styles.quickStats}`}>
              {/* Статус */}
              <div className={styles.stat}>
                <span>Статус</span>
                <span
                  className={`${styles.statusBadge} ${styles[item.status]}`}
                >
                  {item.status && validateStatus(item.status)}
                </span>
              </div>

              {/* Артикул */}
              <div className={styles.stat}>
                <span>Артикул</span>
                <code>{item.article || "—"}</code>
              </div>

              {/* Серийный номер — критично для быстрой сверки */}
              <div className={styles.stat}>
                <span>S/N</span>
                <code className={styles.serial}>
                  {item.serial_number || "нет"}
                </code>
              </div>

              <hr className={styles.divider} />

              {/* Новые полезные метрики */}
              <div className={styles.stat}>
                <span>В работе</span>
                <span>{calculateDaysInWork(item.created_at)} дн.</span>
              </div>

              <div className={styles.stat}>
                <span>Окупаемость</span>
                <span className={styles.roiPositive}>-</span>
              </div>
            </div>
          </aside>

          {/* Правая колонка: Характеристики и аренда */}
          <main className={styles.rightCol}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Подробная информация</h2>
              </div>
              <div className={styles.cardContent}>
                <ItemDetailsList item={item} />
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Информация об аренде</h2>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.rentalPrice}>
                  <span className={styles.label}>Цена за сутки</span>
                  <span className={styles.value}>{item.daily_price} ₽</span>
                </div>
                {/* Сюда можно будет добавить историю последних аренд */}
              </div>
            </section>
          </main>
        </div>
      </div>
    </PageWrapper>
  );
}
