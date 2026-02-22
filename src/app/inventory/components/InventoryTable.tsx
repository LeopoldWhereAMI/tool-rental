"use client";

import styles from "./InventoryTable.module.css";
import { useState } from "react";
import { InventoryUI } from "@/types";
import { deleteInventory } from "@/services/inventoryService";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import EmptyBlock from "@/components/ui/EmptyBlock/EmptyBlock";
import { useMenuAnchor } from "@/components/Portal/useMenuAnchor";
import InventoryRow from "./InventoryRow";

type InventoryTableProps = {
  items: InventoryUI[];
  viewMode: "table" | "grid";
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
              <th className={styles.colProduct}>Инструмент / Арт</th>
              <th className={styles.colCategory}>Категория</th>
              <th className={styles.colStatus}>Статус</th>
              <th className={styles.colPrice}>Стоимость</th>
              <th className={styles.colStock}>Наличие</th>
              <th className={styles.colActions}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <InventoryRow
                  key={item.id}
                  item={item}
                  openMenuId={openMenuId}
                  anchor={anchor}
                  toggleMenu={(e, id) =>
                    toggleMenu(e as React.MouseEvent<HTMLElement>, id)
                  }
                  closeMenu={closeMenu}
                  setDeleteItemId={setDeleteItemId}
                />
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
