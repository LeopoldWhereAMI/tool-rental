// "use client";

// import styles from "../page.module.css";
// import { validateCategory, validateStatus } from "@/helpers";
// import { Box, EllipsisVertical, Fuel, Plug } from "lucide-react";
// import { useEffect, useState } from "react";
// import { InventoryUI } from "@/types";
// import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
// import { deleteInventory } from "@/services/inventoryService";
// import { toast } from "sonner";
// import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
// import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
// import EmptyBlock from "@/components/ui/EmptyBlock/EmptyBlock";
// import InventorySkeleton from "./InventorySceleton";
// import { useMenuAnchor } from "@/components/Portal/useMenuAnchor";

// type InventoryListProps = {
//   items: InventoryUI[];
//   viewMode: "table" | "grid";
//   loading: boolean;
//   error: string | null;
//   refresh: () => void;
// };

// const getStatusClass = (status: string) => {
//   switch (status) {
//     case "available":
//       return styles.statusAvailable;
//     case "rented":
//       return styles.statusRented;
//     case "maintenance":
//       return styles.statusMaintenance;
//     default:
//       return styles.statusDefault;
//   }
// };

// export default function InventoryList({
//   items,
//   viewMode,
//   loading,
//   error,
//   refresh,
// }: InventoryListProps) {
//   const { openMenuId, anchor, toggleMenu, closeMenu } = useMenuAnchor();
//   const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
//   const itemToDelete = items.find((item) => item.id === deleteItemId);

//   const handleConfirmDelete = async () => {
//     if (!deleteItemId) return;
//     try {
//       await deleteInventory(deleteItemId);
//       toast.success("Инструмент удалён");
//       await refresh();
//     } catch (err) {
//       toast.error("Ошибка при удалении");
//       console.error(err);
//     } finally {
//       setDeleteItemId(null);
//     }
//   };

//   const getCategoryIcon = (category: string) => {
//     switch (category) {
//       case "gas_tools":
//         return <Fuel size={16} className={styles.gasIcon} />;
//       case "electric_tools":
//         return <Plug size={16} className={styles.electricIcon} />;
//       default:
//         return <Box size={16} className={styles.defaultIcon} />;
//     }
//   };

//   useEffect(() => {
//     if (openMenuId) {
//       const originalStyle = window.getComputedStyle(document.body).overflow;
//       document.body.style.overflow = "hidden";

//       return () => {
//         document.body.style.overflow = originalStyle;
//       };
//     }
//   }, [openMenuId]);

//   const wrapperClass = `${styles.tableWrapper} ${viewMode === "grid" ? styles.forceGrid : ""}`;

//   if (loading) {
//     return <InventorySkeleton />;
//   }

//   if (error) {
//     return <ErrorBlock message={error} />;
//   }

//   return (
//     <>
//       <div className={wrapperClass}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Артикул</th>
//               <th>Инструмент</th>
//               <th>Категория</th>
//               <th>Серийный номер</th>
//               <th>Статус</th>
//               <th>Стоимость</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.length > 0 ? (
//               items.map((item) => (
//                 <tr key={item.id}>
//                   <td data-label="Артикул" className={styles.articleCell}>
//                     <div className={styles.primaryText}>{item.article}</div>
//                   </td>
//                   <td data-label="Инструмент">
//                     <div className={styles.nameCell}>
//                       <div
//                         data-label="Категория"
//                         className={styles.iconWrapper}
//                       >
//                         {item.category && getCategoryIcon(item.category)}
//                       </div>
//                       <span className={styles.itemName}>{item.name}</span>
//                     </div>
//                   </td>
//                   <td data-label="Категория">
//                     <span className={styles.secondaryText}>
//                       {item.category && validateCategory(item.category)}
//                     </span>
//                   </td>
//                   <td data-label="Серийный номер">
//                     <span className={styles.secondaryText}>
//                       {item.serial_number}
//                     </span>
//                   </td>
//                   <td>
//                     {item.status && (
//                       <span
//                         className={`${styles.statusBadge} ${getStatusClass(item.status)}`}
//                       >
//                         {validateStatus(item.status)}
//                       </span>
//                     )}
//                   </td>
//                   <td data-label="Стоимость">
//                     <div className={styles.priceContainer}>
//                       <span>{item.daily_price} ₽/сут</span>
//                     </div>
//                   </td>
//                   <td>
//                     <button
//                       type="button"
//                       data-menu-trigger={item.id}
//                       className={styles.actionButton}
//                       onClick={(e) => toggleMenu(e, item.id)}
//                     >
//                       <EllipsisVertical size={18} />
//                     </button>
//                     {openMenuId === item.id && (
//                       <ActionsMenu
//                         id={item.id}
//                         anchor={anchor}
//                         currentStatus={item.status}
//                         onClose={closeMenu}
//                         onDeleteClick={() => {
//                           setDeleteItemId(item.id);
//                           closeMenu();
//                         }}
//                       />
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={7} className={styles.emptyRow}>
//                   <EmptyBlock
//                     isSearch={true}
//                     message="По вашему запросу ничего не найдено"
//                   />
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <DeleteConfirmModal
//         isOpen={!!deleteItemId}
//         onClose={() => setDeleteItemId(null)}
//         onConfirm={handleConfirmDelete}
//         itemName={itemToDelete?.name}
//         itemType="инструмент"
//       />
//     </>
//   );
// }

"use client";

import styles from "../page.module.css";
// Импортируем оба хелпера
import { validateCategory, validateStatus } from "@/helpers";
import { EllipsisVertical, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { InventoryUI } from "@/types";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import { deleteInventory } from "@/services/inventoryService";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import EmptyBlock from "@/components/ui/EmptyBlock/EmptyBlock";

import { useMenuAnchor } from "@/components/Portal/useMenuAnchor";
import Image from "next/image";

type InventoryListProps = {
  items: InventoryUI[];
  viewMode: "table" | "grid";
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

// Возвращаем старую функцию маппинга классов
const getStatusClass = (status: string) => {
  switch (status) {
    case "available":
      return styles.statusAvailable;
    case "rented":
      return styles.statusRented;
    case "maintenance":
      return styles.statusMaintenance;
    default:
      return styles.statusDefault;
  }
};

export default function InventoryList({
  items,
  viewMode,
  error,
  refresh,
}: InventoryListProps) {
  const { openMenuId, anchor, toggleMenu, closeMenu } = useMenuAnchor();
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const itemToDelete = items.find((item) => item.id === deleteItemId);

  const handleConfirmDelete = async () => {
    if (!deleteItemId) return;
    try {
      await deleteInventory(deleteItemId);
      toast.success("Инструмент удалён");
      await refresh();
    } catch (err) {
      toast.error("Ошибка при удалении");
      console.error(err);
    } finally {
      setDeleteItemId(null);
    }
  };

  if (error) return <ErrorBlock message={error} />;

  if (viewMode === "grid") {
    return (
      <div className={styles.inventoryListWrapper}>
        <EmptyBlock
          message="Grid view is under construction"
          isSearch={false}
        />
      </div>
    );
  }

  return (
    <>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Инструмент / Арт</th>
              <th style={{ width: "15%", textAlign: "center" }}>Категория</th>
              <th style={{ width: "15%", textAlign: "center" }}>Статус</th>
              <th style={{ width: "15%" }}>Стоимость</th>
              <th style={{ width: "15%" }}>Наличие</th>
              <th style={{ width: "10%", textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  {/* Tool Name / ID */}
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.productImagePlaceholder}>
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            unoptimized
                            style={{ objectFit: "cover" }}
                            className={styles.productImage}
                            sizes="44px"
                          />
                        ) : (
                          <ImageIcon size={24} color="#9ca3af" />
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <span className={styles.productName}>{item.name}</span>
                        <span className={styles.productId}>
                          Арт: {item.article || item.serial_number}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ textAlign: "center" }}>
                    <span className={styles.categoryBadge}>
                      {item.category && validateCategory(item.category)}
                    </span>
                  </td>

                  {/* Status - ИНТЕГРАЦИЯ СТАРЫХ ФУНКЦИЙ */}
                  <td style={{ textAlign: "center" }}>
                    {item.status && (
                      <span
                        className={`${styles.statusBadge} ${getStatusClass(item.status)}`}
                      >
                        <span className={styles.dot}></span>
                        {validateStatus(item.status)}
                      </span>
                    )}
                  </td>

                  {/* Daily Rate */}
                  <td>
                    <div className={styles.priceCell}>
                      {item.daily_price} ₽{" "}
                      <span className={styles.pricePeriod}>/ сут</span>
                    </div>
                  </td>

                  {/* Availability Visual */}
                  <td>
                    <div className={styles.availabilityWrapper}>
                      <span className={styles.availabilityRatio}>
                        {/* 1/1 если доступен или забронирован, 0/1 если в ремонте или аренде */}
                        {item.status === "available" ? "1/1" : "0/1"}
                      </span>
                      <div className={styles.progressBarBg}>
                        <div
                          className={styles.progressBarFill}
                          style={{
                            // Заполняем шкалу, если статус "available"
                            width: item.status === "available" ? "100%" : "0%",
                            // Опционально: можно добавить цвет из CSS переменной вашего статуса
                            backgroundColor:
                              item.status === "available"
                                ? "var(--status-available-color, #10b981)"
                                : "#32353b",
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      data-menu-trigger={item.id}
                      className={styles.actionButton}
                      onClick={(e) => toggleMenu(e, item.id)}
                    >
                      <EllipsisVertical size={18} />
                    </button>
                    {openMenuId === item.id && (
                      <ActionsMenu
                        id={item.id}
                        anchor={anchor}
                        currentStatus={item.status}
                        onClose={closeMenu}
                        onDeleteClick={() => {
                          setDeleteItemId(item.id);
                          closeMenu();
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <EmptyBlock
                    isSearch={true}
                    message="Инструменты не найдены"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
        itemType="инструмент"
      />
    </>
  );
}
