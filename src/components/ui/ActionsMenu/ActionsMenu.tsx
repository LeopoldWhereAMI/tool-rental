"use client";

import Link from "next/link";
import styles from "./ActionsMenu.module.css";
import { useInventory } from "@/hooks/useInventory";
import { updateInventoryStatus } from "@/services/inventoryService";
import { toast } from "sonner";
import { useRef } from "react";
import useClickOutside from "@/hooks/useClickOutside";

import {
  ExternalLink,
  Pencil,
  Wrench,
  CheckCircle,
  Trash2,
  XCircle,
} from "lucide-react";

type ActionsMenuProps = {
  id: string;
  onClose: () => void;
  currentStatus?: string;
  onDeleteClick: () => void;
  onStatusUpdate?: (id: string, newStatus: any) => Promise<void>;
  type?: "inventory" | "order";
};

export default function ActionsMenu({
  id,
  onClose,
  currentStatus,
  onDeleteClick,
  onStatusUpdate,
  type = "inventory",
}: ActionsMenuProps) {
  const { refresh } = useInventory();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(menuRef, onClose);

  // Функция смены статуса инструмента
  const handleStatusChange = async (newStatus: "maintenance" | "available") => {
    try {
      await updateInventoryStatus(id, newStatus);
      toast.success(
        newStatus === "maintenance"
          ? "Инструмент в ремонте"
          : "Инструмент готов к работе",
      );
      await refresh();
      onClose(); // Закрываем меню после действия
    } catch (error) {
      toast.error("Ошибка при обновлении статуса");
      console.error(error);
    }
  };

  const handleAction = async (status: string) => {
    if (onStatusUpdate) {
      await onStatusUpdate(id, status);
      onClose();
    }
  };

  return (
    <div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      className={styles.actionsMenu}
    >
      <ul className={styles.actionsMenuList}>
        {/* Общие действия */}
        <li>
          <Link
            href={`/${type === "inventory" ? "inventory" : "orders"}/${id}`}
          >
            <ExternalLink size={16} />
            Открыть
          </Link>
        </li>

        {/* Специфические действия для ИНВЕНТАРЯ */}

        {type === "inventory" && (
          <>
            <li>
              <Link href={`/inventory/edit/${id}`}>
                <Pencil size={16} /> Редактировать
              </Link>
            </li>
            {currentStatus !== "maintenance" ? (
              <li>
                <button
                  onClick={() => handleStatusChange("maintenance")}
                  className={styles.maintenanceBtn}
                >
                  <Wrench size={16} /> В ремонт
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => handleStatusChange("available")}
                  className={styles.availableBtn}
                >
                  <CheckCircle size={16} /> В работу
                </button>
              </li>
            )}
          </>
        )}

        {/* Специфические действия для ЗАКАЗОВ */}
        {type === "order" && currentStatus === "active" && (
          <>
            <li>
              <button
                onClick={() => handleAction("completed")}
                className={styles.availableBtn}
              >
                <CheckCircle size={16} /> Завершить аренду
              </button>
            </li>
            <li>
              <button
                onClick={() => handleAction("cancelled")}
                className={styles.cancelBtn}
              >
                <XCircle size={16} /> Отменить заказ
              </button>
            </li>
          </>
        )}

        {/* Разделитель */}
        <div className={styles.deleteSeparator} />
        <li>
          <button onClick={onDeleteClick} className={styles.deleteBtn}>
            <Trash2 size={16} /> Удалить
          </button>
        </li>
      </ul>
    </div>
  );
}
