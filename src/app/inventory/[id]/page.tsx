// "use client";

// import PageWrapper from "@/components/PageWrapper/PageWrapper";
// import { useInventoryItem } from "@/hooks/useInventoryItem";
// import { useParams } from "next/navigation";
// import styles from "./page.module.css";
// import Link from "next/link";
// import BackButton from "@/components/BackButton/BackButton";
// import ItemDetailsList from "@/components/Inventory/ItemDetailsList/ItemDetailsList";
// import ItemGallery from "@/components/Inventory/ItemGallery/ItemGallery";
// import { calculateDaysInWork, validateStatus } from "@/helpers";
// import InventoryItemSkeleton from "./InventoryItemSkeleton";
// import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
// import { toast } from "sonner";
// import { resetMaintenanceCounter } from "@/services/inventoryService";
// import MaintenanceProgress from "@/components/MaintenanceProgress/MaintenanceProgress";
// import { useState } from "react";
// import MaintenanceConfirmModal from "@/components/ui/MyModal/MaintenanceConfirmModal";

// export default function InventoryItemPage() {
//   const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
//   const [isResetting, setIsResetting] = useState(false);
//   const params = useParams();
//   const id = params.id as string;
//   const { item, loading, error, mutate } = useInventoryItem(id);

//   const handleResetTO = async () => {
//     setIsResetting(true);
//     try {
//       await resetMaintenanceCounter(id);
//       toast.success("Техническое обслуживание зафиксировано");
//       mutate();
//       setIsMaintenanceModalOpen(false);
//     } catch (err) {
//       toast.error("Не удалось сбросить счетчик");
//       console.error(err);
//     } finally {
//       setIsResetting(false);
//     }
//   };
//   if (loading) return <InventoryItemSkeleton />;

//   if (error || !item) {
//     return <ErrorBlock message="Инструмент не найден в базе данных" />;
//   }

//   return (
//     <PageWrapper>
//       <div className={styles.container}>
//         <header className={styles.header}>
//           <BackButton href="/inventory" />
//           <Link href={`/inventory/edit/${id}`} className={styles.editBtn}>
//             Редактировать
//           </Link>
//         </header>

//         <div className={styles.mainGrid}>
//           <aside className={styles.leftCol}>
//             <ItemGallery id={id} imageUrl={item.image_url} onMutate={mutate} />

//             <div className={`${styles.card} ${styles.quickStats}`}>
//               <div className={styles.stat}>
//                 <span>Статус</span>
//                 <span
//                   className={`${styles.statusBadge} ${styles[item.status]}`}
//                 >
//                   {item.status && validateStatus(item.status)}
//                 </span>
//               </div>

//               <div className={styles.stat}>
//                 <span>Артикул</span>
//                 <code>{item.article || "—"}</code>
//               </div>

//               <div className={styles.stat}>
//                 <span>S/N</span>
//                 <code className={styles.serial}>
//                   {item.serial_number || "нет"}
//                 </code>
//               </div>

//               <hr className={styles.divider} />

//               <div className={styles.maintenanceSection}>
//                 <MaintenanceProgress
//                   current={item.work_days_count || 0}
//                   interval={item.maintenance_interval_days || 30}
//                   onReset={() => setIsMaintenanceModalOpen(true)}
//                 />
//               </div>

//               <hr className={styles.divider} />

//               <div className={styles.stat}>
//                 <span>В парке</span>
//                 <span>{calculateDaysInWork(item.created_at)} дн.</span>
//               </div>

//               <div className={styles.stat}>
//                 <span>Последнее ТО</span>
//                 <span className={styles.lastMaintenance}>
//                   {item.last_maintenance_date
//                     ? new Date(item.last_maintenance_date).toLocaleDateString(
//                         "ru-RU",
//                       )
//                     : "Не проводилось"}
//                 </span>
//               </div>

//               <div className={styles.stat}>
//                 <span>Окупаемость</span>
//                 <span className={styles.roiPositive}>-</span>
//               </div>
//             </div>
//           </aside>

//           <main className={styles.rightCol}>
//             <section className={styles.card}>
//               <div className={styles.cardHeader}>
//                 <h2>Подробная информация</h2>
//               </div>
//               <div className={styles.cardContent}>
//                 <ItemDetailsList item={item} />
//               </div>
//             </section>

//             <section className={styles.card}>
//               <div className={styles.cardHeader}>
//                 <h2>Информация об аренде</h2>
//               </div>
//               <div className={styles.cardContent}>
//                 <div className={styles.rentalPrice}>
//                   <span className={styles.label}>Цена за сутки</span>
//                   <span className={styles.value}>{item.daily_price} ₽</span>
//                 </div>
//               </div>
//             </section>
//           </main>
//         </div>
//       </div>
//       <MaintenanceConfirmModal
//         isOpen={isMaintenanceModalOpen}
//         onClose={() => setIsMaintenanceModalOpen(false)}
//         onConfirm={handleResetTO}
//         loading={isResetting}
//       />
//     </PageWrapper>
//   );
// }

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import styles from "./page.module.css";

// Hooks & Services
import { useInventoryItem } from "@/hooks/useInventoryItem";
import { resetMaintenanceCounter } from "@/services/inventoryService";
// Возвращаем все ваши проверенные хелперы
import {
  calculateDaysInWork,
  validateStatus,
  validateCategory,
} from "@/helpers";

import InventoryItemSkeleton from "./InventoryItemSkeleton";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import MaintenanceConfirmModal from "@/components/ui/MyModal/MaintenanceConfirmModal";

import {
  ChevronRight,
  ClipboardList,
  Pencil,
  Settings,
  TrendingUp,
  WrenchIcon,
} from "lucide-react";
import ItemGallery from "@/components/Inventory/ItemGallery/ItemGallery";
import ItemDetailsList from "@/components/Inventory/ItemDetailsList/ItemDetailsList";
import MaintenanceProgress from "@/components/MaintenanceProgress/MaintenanceProgress";
import ItemRentalHistory from "@/components/Inventory/ItemRentalHistory/ItemRentalHistory";

export default function InventoryItemPage() {
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const params = useParams();
  const id = params.id as string;

  const { item, loading, error, mutate } = useInventoryItem(id);

  const handleResetTO = async () => {
    setIsResetting(true);
    try {
      await resetMaintenanceCounter(id);
      toast.success("Техническое обслуживание зафиксировано");
      mutate();
      setIsMaintenanceModalOpen(false);
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

  const purchasePrice = item.purchase_price || 0;
  const totalEarned = (item.work_days_count || 0) * (item.daily_price || 0);
  const roiPercentage =
    purchasePrice > 0 ? Math.round((totalEarned / purchasePrice) * 100) : 0;

  // Расчет загрузки (Utilization)
  const daysDisplay = calculateDaysInWork(item.created_at);

  const utilizationRate = Math.min(
    Math.round(((item.work_days_count || 0) / (daysDisplay || 1)) * 100),
    100,
  );

  return (
    <div className={styles.pageContainer}>
      {/* Хлебные крошки */}
      <nav className={styles.breadcrumbs}>
        <Link href="/inventory" className={styles.breadcrumbLink}>
          Инвентарь
        </Link>

        <ChevronRight size={14} className={styles.breadcrumbSeparator} />

        <span className={styles.breadcrumbCategory}>
          {item.category ? validateCategory(item.category) : "Без категории"}
        </span>

        <ChevronRight size={14} className={styles.breadcrumbSeparator} />

        <span className={styles.breadcrumbCurrent}>{item.name}</span>
      </nav>

      {/* Заголовок и кнопки */}
      <div className={styles.headerSection}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h1>{item.name}</h1>
            <span className={`${styles.statusBadge} ${styles[item.status]}`}>
              {item.status ? validateStatus(item.status) : "Неизвестно"}
            </span>
          </div>
          <div className={styles.metaInfo}>
            <span>Арт. {item.article || "—"}</span>
            <span className={styles.divider}>|</span>
            <span>S/N. {item.serial_number || "—"}</span>
          </div>
        </div>

        <div className={styles.actionsBar}>
          <button
            onClick={() => setIsMaintenanceModalOpen(true)}
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            <WrenchIcon width={18} /> Обслуживание
          </button>
          <Link
            href={`/inventory/edit/${id}`}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            <Pencil width={18} /> Редактировать
          </Link>
        </div>
      </div>

      {/* --- ОСНОВНАЯ СЕТКА --- */}
      <div className={styles.dashboardGrid}>
        {/* КОЛОНКА 1: Фото (Галерея) */}
        <div className={styles.colGallery}>
          <ItemGallery id={id} imageUrl={item.image_url} onMutate={mutate} />
        </div>

        {/* КОЛОНКА 2: Метрики (Стек из 3 карточек) */}
        <div className={styles.colMetrics}>
          {/* 1. Окупаемость */}
          <div className={styles.metricCardSmall}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>
                Окупаемость (на основе тарифа)
              </span>
              <div className={`${styles.iconBox} ${styles.iconGreen}`}>
                <TrendingUp size={16} />
              </div>
            </div>
            <div className={styles.metricContent}>
              <span className={styles.bigNumber}>{roiPercentage}%</span>
              <span className={styles.subTextGreen}>
                +{totalEarned.toLocaleString()} ₽
              </span>
            </div>
          </div>

          {/* 2. Загрузка */}
          <div className={styles.metricCardSmall}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>Загрузка</span>
              <div className={`${styles.iconBox} ${styles.iconBlue}`}>
                <Settings size={16} />
              </div>
            </div>
            <div className={styles.metricContent}>
              <span className={styles.bigNumber}>{utilizationRate}%</span>
              <div className={styles.miniProgress}>
                <div style={{ width: `${utilizationRate}%` }}></div>
              </div>
              <p className={styles.subValueBlue}>
                {item.work_days_count || 0} из {daysDisplay} дн. в работе
              </p>
            </div>
          </div>

          {/* 3. Тех. обслуживание */}
          <div className={styles.metricCardSmall}>
            <div className={styles.metricHeader}>
              <span className={styles.metricTitle}>До следующего ТО</span>
              <div className={`${styles.iconBox} ${styles.iconOrange}`}>
                <WrenchIcon size={16} />
              </div>
            </div>
            <div className={styles.metricContentPadding}>
              <MaintenanceProgress
                current={item.work_days_count || 0}
                interval={item.maintenance_interval_days || 30}
                // onReset={() => setIsMaintenanceModalOpen(true)}
                // lastMaintenanceDate={item.last_maintenance_date}
              />
            </div>
          </div>
        </div>

        {/* КОЛОНКА 3: Технические данные */}
        <div className={styles.colDetails}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <ClipboardList size={20} className={styles.iconBlue} />
                Технические данные
              </h3>
            </div>
            <div className={styles.cardContent}>
              <ItemDetailsList item={item} />
            </div>
          </div>
        </div>

        {/* НИЖНИЙ РЯД: История аренды */}
        <div className={styles.colHistory}>
          <ItemRentalHistory itemId={id} />
        </div>
      </div>

      <MaintenanceConfirmModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        onConfirm={handleResetTO}
        loading={isResetting}
      />
    </div>
  );
}
