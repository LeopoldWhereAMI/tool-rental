"use client";

import styles from "./InventoryTable.module.css";
import { useState } from "react";
import { InventoryUI, ViewMode } from "@/types";
import { deleteInventory } from "@/services/inventoryService";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import EmptyBlock from "@/components/ui/EmptyBlock/EmptyBlock";
import { useMenuAnchor } from "@/components/Portal/useMenuAnchor";
import InventoryRow from "./InventoryRow";
import InventoryCard from "./InventoryCard";

type InventoryTableProps = {
  items: InventoryUI[];
  viewMode: ViewMode;
  loading?: boolean;
  error: string | null;
  refresh: () => void;
};

export default function InventoryTable({
  items,
  viewMode,
  error,
  refresh,
}: InventoryTableProps) {
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

  const commonProps = {
    openMenuId,
    anchor,
    toggleMenu: (e: React.MouseEvent, id: string) =>
      toggleMenu(e as React.MouseEvent<HTMLElement>, id),
    closeMenu,
    setDeleteItemId,
  };

  // Выносим рендер контента, чтобы основной return был читаемым
  const renderContent = () => {
    if (items.length === 0) {
      return <EmptyBlock isSearch={true} message="Инструменты не найдены" />;
    }

    if (viewMode === "table") {
      return (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colProduct}>Инструмент / Арт</th>
                <th className={styles.colCategory}>Категория</th>
                <th className={styles.colStatus}>Статус</th>
                <th className={styles.colPrice}>Стоимость</th>
                <th className={styles.colStock}>Наличие</th>
                <th className={styles.colActions}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <InventoryRow key={item.id} item={item} {...commonProps} />
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Режим карточек
    return (
      <div className={styles.cardsContainer}>
        {items.map((item) => (
          <InventoryCard key={item.id} item={item} {...commonProps} />
        ))}
      </div>
    );
  };

  // Тот самый единственный правильный return компонента
  return (
    <div className={styles.mainWrapper}>
      {renderContent()}

      <DeleteConfirmModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
        itemType="инструмент"
      />
    </div>
  );
}
