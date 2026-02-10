"use client";

import styles from "../page.module.css";
import { validateCategory, validateStatus } from "@/helpers";
import { Box, EllipsisVertical, Fuel, Plug } from "lucide-react";
import { useState } from "react";
import { InventoryUI } from "@/types";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import { deleteInventory } from "@/services/inventoryService";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import EmptyBlock from "@/components/ui/EmptyBlock/EmptyBlock";
import InventorySkeleton from "./InventorySceleton";

type InventoryListProps = {
  items: InventoryUI[];
  // selectedCategory: string;
  // onCategoryChange: (value: string) => void;
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
  loading,
  error,
  refresh,
}: InventoryListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  // Состояние для удаления
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  // Находим данные выбранного для удаления элемента
  const itemToDelete = items.find((item) => item.id === deleteItemId);

  const toggleMenu = (id: string) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

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

  if (loading) {
    return <InventorySkeleton />;
  }

  if (error) {
    return <ErrorBlock message={error} />;
  }

  return (
    <>
      <div className={styles.tableWrapper}>
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
                  <td>
                    <div className={styles.primaryText}>{item.article}</div>
                  </td>
                  <td>
                    <div className={styles.nameCell}>
                      <div className={styles.iconWrapper}>
                        {item.category && getCategoryIcon(item.category)}
                      </div>
                      <span className={styles.itemName}>{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.secondaryText}>
                      {item.category && validateCategory(item.category)}
                    </span>
                  </td>
                  <td>
                    <span className={styles.primaryText}>
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
                  <td>
                    <div className={styles.priceContainer}>
                      {item.daily_price}
                      <span className={styles.currency}>₽/сут</span>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      data-menu-trigger={item.id}
                      className={styles.actionButton}
                      onClick={() => toggleMenu(item.id)}
                    >
                      <EllipsisVertical size={18} />
                    </button>
                    {openMenuId === item.id && (
                      <ActionsMenu
                        id={item.id}
                        currentStatus={item.status}
                        onClose={() => setOpenMenuId(null)}
                        onDeleteClick={() => {
                          setDeleteItemId(item.id);
                          setOpenMenuId(null);
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
