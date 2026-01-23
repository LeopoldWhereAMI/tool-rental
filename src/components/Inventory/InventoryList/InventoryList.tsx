"use client";

import styles from "./InventoryList.module.css";
import {
  inventoryListTitles,
  validateCategory,
  validateStatus,
} from "@/helpers";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { InventoryUI } from "@/types";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import { deleteInventory } from "@/services/inventoryService";
import { toast } from "sonner";

import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";

type InventoryListProps = {
  items: InventoryUI[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
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
  selectedCategory,
  onCategoryChange,
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

  if (loading) {
    return <LoadingState />;
  }
  if (error) {
    return <ErrorState error={error} onRetry={refresh} />;
  }

  if (items.length === 0) {
    return (
      <div>
        <p className={styles.emptyInventoryMessage}>Инвентарь пуст</p>
      </div>
    );
  }

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            {inventoryListTitles.map((title) => (
              <th key={title.id}>
                {title.filter === "select" ? (
                  <div className={styles.selectWrapper}>
                    <select
                      value={selectedCategory}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className={styles.select}
                    >
                      <option value="">Все категории</option>
                      <option value="gas_tools">Бензоинструмент</option>
                      <option value="electric_tools">Электроинструмент</option>
                    </select>
                  </div>
                ) : (
                  title.text
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className={styles.titlesRow}>
              <td>{item.article}</td>
              <td>{item.name}</td>
              <td>{item.category && validateCategory(item.category)}</td>
              <td>{item.serial_number}</td>
              <td>{item.quantity} шт.</td>
              <td>
                {item.status && (
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(item.status)}`}
                  >
                    {validateStatus(item.status)}
                  </span>
                )}
              </td>
              <td>{item.daily_price}р</td>

              <td>
                <button
                  data-menu-trigger={item.id}
                  aria-label="Действия"
                  className={styles.actionButton}
                  onClick={() => toggleMenu(item.id)}
                >
                  <EllipsisVertical size={16} />
                </button>
                {openMenuId === item.id && (
                  <ActionsMenu
                    id={item.id}
                    currentStatus={item.status}
                    onClose={() => setOpenMenuId(null)}
                    onDeleteClick={() => {
                      setDeleteItemId(item.id); // Открываем модалку, устанавливая ID
                      setOpenMenuId(null); // Сразу закрываем маленькое меню
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
