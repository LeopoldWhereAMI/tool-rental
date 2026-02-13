"use client";

import styles from "../page.module.css";
import { validateCategory, validateStatus } from "@/helpers";
import { Box, EllipsisVertical, Fuel, Plug } from "lucide-react";
import { useEffect, useState } from "react";
import { InventoryUI } from "@/types";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import { deleteInventory } from "@/services/inventoryService";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import EmptyBlock from "@/components/ui/EmptyBlock/EmptyBlock";
import InventorySkeleton from "./InventorySceleton";
import { useMenuAnchor } from "@/components/Portal/useMenuAnchor";

type InventoryListProps = {
  items: InventoryUI[];
  viewMode: "table" | "grid";
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

// Добавляем вспомогательную функцию внутри или снаружи компонента
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
  loading,
  error,
  refresh,
}: InventoryListProps) {
  const { openMenuId, anchor, toggleMenu, closeMenu } = useMenuAnchor();
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const itemToDelete = items.find((item) => item.id === deleteItemId);

  // Функция подтверждения удаления
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

  // Вспомогательная функция для получения иконки категории
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "gas_tools":
        return <Fuel size={16} className={styles.gasIcon} />;
      case "electric_tools":
        return <Plug size={16} className={styles.electricIcon} />;
      default:
        return <Box size={16} className={styles.defaultIcon} />;
    }
  };

  useEffect(() => {
    if (openMenuId) {
      // Сохраняем текущее состояние overflow, чтобы вернуть его позже
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [openMenuId]);

  const wrapperClass = `${styles.tableWrapper} ${viewMode === "grid" ? styles.forceGrid : ""}`;

  if (loading) {
    return <InventorySkeleton />;
  }

  if (error) {
    return <ErrorBlock message={error} />;
  }

  return (
    <>
      <div className={wrapperClass}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Артикул</th>
              <th>Инструмент</th>
              <th>Категория</th>
              <th>Серийный номер</th>
              <th>Статус</th>
              <th>Стоимость</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td data-label="Артикул" className={styles.articleCell}>
                    <div className={styles.primaryText}>{item.article}</div>
                  </td>
                  <td data-label="Инструмент">
                    <div className={styles.nameCell}>
                      <div
                        data-label="Категория"
                        className={styles.iconWrapper}
                      >
                        {item.category && getCategoryIcon(item.category)}
                      </div>
                      <span className={styles.itemName}>{item.name}</span>
                    </div>
                  </td>
                  <td data-label="Категория">
                    <span className={styles.secondaryText}>
                      {item.category && validateCategory(item.category)}
                    </span>
                  </td>
                  <td data-label="Серийный номер">
                    <span className={styles.secondaryText}>
                      {item.serial_number}
                    </span>
                  </td>
                  <td>
                    {item.status && (
                      <span
                        className={`${styles.statusBadge} ${getStatusClass(item.status)}`}
                      >
                        {validateStatus(item.status)}
                      </span>
                    )}
                  </td>
                  <td data-label="Стоимость">
                    <div className={styles.priceContainer}>
                      <span>{item.daily_price} ₽/сут</span>
                    </div>
                  </td>
                  <td>
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
                <td colSpan={7} className={styles.emptyRow}>
                  <EmptyBlock
                    isSearch={true}
                    message="По вашему запросу ничего не найдено"
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
