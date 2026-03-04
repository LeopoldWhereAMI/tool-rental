"use client";

import styles from "../page.module.css";
import { validateCategory, validateStatus } from "@/helpers";
import { EllipsisVertical, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
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

                  <td style={{ textAlign: "center" }}>
                    <span className={styles.categoryBadge}>
                      {item.category && validateCategory(item.category)}
                    </span>
                  </td>

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

                  <td>
                    <div className={styles.priceCell}>
                      {item.daily_price} ₽{" "}
                      <span className={styles.pricePeriod}>/ сут</span>
                    </div>
                  </td>

                  <td>
                    <div className={styles.availabilityWrapper}>
                      <span className={styles.availabilityRatio}>
                        {item.status === "available" ? "1/1" : "0/1"}
                      </span>
                      <div className={styles.progressBarBg}>
                        <div
                          className={styles.progressBarFill}
                          style={{
                            width: item.status === "available" ? "100%" : "0%",

                            backgroundColor:
                              item.status === "available"
                                ? "var(--status-available-color, #10b981)"
                                : "#32353b",
                          }}
                        />
                      </div>
                    </div>
                  </td>

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
