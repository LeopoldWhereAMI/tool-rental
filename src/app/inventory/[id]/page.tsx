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
import InventoryItemSkeleton from "./InventoryItemSkeleton";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import { toast } from "sonner";
import { resetMaintenanceCounter } from "@/services/inventoryService";
import MaintenanceProgress from "@/components/MaintenanceProgress/MaintenanceProgress";
import { useState } from "react";
import MaintenanceConfirmModal from "@/components/ui/MyModal/MaintenanceConfirmModal";

export default function InventoryItemPage() {
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const params = useParams();
  const id = params.id as string;
  const { item, loading, error, mutate } = useInventoryItem(id);

  // Обработчик сброса ТО
  const handleResetTO = async () => {
    setIsResetting(true);
    try {
      await resetMaintenanceCounter(id);
      toast.success("Техническое обслуживание зафиксировано");
      mutate();
      setIsMaintenanceModalOpen(false); // Закрываем модалку
    } catch (err) {
      toast.error("Не удалось сбросить счетчик");
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };
  if (loading) return <InventoryItemSkeleton />;

  if (error || !item) {
    return <ErrorBlock message="Инструмент не найден в базе данных" />;
  }

  return (
    <PageWrapper>
      <div className={styles.container}>
        {/* Верхняя панель навигации */}
        <header className={styles.header}>
          <BackButton href="/inventory" />
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

              {/* БЛОК ТЕХНИЧЕСКОГО ОБСЛУЖИВАНИЯ */}
              <div className={styles.maintenanceSection}>
                <MaintenanceProgress
                  current={item.work_days_count || 0}
                  interval={item.maintenance_interval_days || 30}
                  onReset={() => setIsMaintenanceModalOpen(true)}
                />
              </div>

              <hr className={styles.divider} />

              <div className={styles.stat}>
                <span>В парке</span>
                <span>{calculateDaysInWork(item.created_at)} дн.</span>
              </div>

              <div className={styles.stat}>
                <span>Последнее ТО</span>
                <span className={styles.lastMaintenance}>
                  {item.last_maintenance_date
                    ? new Date(item.last_maintenance_date).toLocaleDateString(
                        "ru-RU",
                      )
                    : "Не проводилось"}
                </span>
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
      <MaintenanceConfirmModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        onConfirm={handleResetTO}
        loading={isResetting}
      />
    </PageWrapper>
  );
}
