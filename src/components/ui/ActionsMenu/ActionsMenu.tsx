"use client";

import Link from "next/link";
import styles from "./ActionsMenu.module.css";
import { useInventory } from "@/hooks/useInventory";
import { updateInventoryStatus } from "@/services/inventoryService";
import { toast } from "sonner";
import { useRef, useEffect, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";

import {
  ExternalLink,
  Pencil,
  Wrench,
  CheckCircle,
  Trash2,
  XCircle,
} from "lucide-react";
import { Portal } from "@/components/Portal/Portal";

type ActionsMenuProps = {
  id: string;
  onClose: () => void;
  anchor: { top: number; left: number } | null;
  currentStatus?: string;
  onDeleteClick: () => void;
  onStatusUpdate?: (id: string, newStatus: string) => Promise<void>;
  type?: "inventory" | "order" | "client";
};

export default function ActionsMenu({
  id,
  onClose,
  anchor,
  currentStatus,
  onDeleteClick,
  onStatusUpdate,
  type = "inventory",
}: ActionsMenuProps) {
  const { refresh } = useInventory();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useClickOutside(menuRef, onClose);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    document.body.classList.add("menu-open");
    return () => {
      window.removeEventListener("resize", checkMobile);
      document.body.classList.remove("menu-open");
    };
  }, []);

  // const desktopStyle: React.CSSProperties =
  //   !isMobile && anchor
  //     ? {
  //         position: "absolute",
  //         top: `${anchor.top + 5}px`,
  //         left: `${anchor.left - 180}px`,
  //       }
  //     : {};

  const desktopStyle: React.CSSProperties = {};
  if (!isMobile && anchor) {
    const menuHeight = 185;
    const viewportHeight = window.innerHeight;

    if (anchor.top + menuHeight + 10 > viewportHeight) {
      desktopStyle.top = `${anchor.top - menuHeight}px`;
    } else {
      desktopStyle.top = `${anchor.top + 5}px`;
    }

    desktopStyle.left = `${anchor.left - 180}px`;
    desktopStyle.position = "absolute";
  }

  const getBasePath = () => {
    switch (type) {
      case "client":
        return "clients";
      case "inventory":
        return "inventory";
      case "order":
        return "orders";
      default:
        return "inventory";
    }
  };

  const handleStatusChange = async (newStatus: "maintenance" | "available") => {
    try {
      await updateInventoryStatus(id, newStatus);
      toast.success(
        newStatus === "maintenance"
          ? "Инструмент в ремонте"
          : "Инструмент готов к работе",
      );
      await refresh();
      onClose();
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
    <Portal>
      <div className={styles.overlay} onClick={onClose} />

      <div
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
        className={styles.actionsMenu}
        style={desktopStyle}
      >
        <ul className={styles.actionsMenuList}>
          <li>
            <Link href={`/${getBasePath()}/${id}`} className={styles.openLink}>
              <ExternalLink size={16} />
              Открыть
            </Link>
          </li>

          {type === "inventory" && (
            <>
              <li>
                <Link
                  href={`/inventory/${id}/edit`}
                  className={styles.editLink}
                >
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

          {type === "order" && currentStatus === "active" && (
            <li>
              <button
                onClick={() => handleAction("cancelled")}
                className={styles.cancelBtn}
              >
                <XCircle size={16} /> Отменить заказ
              </button>
            </li>
          )}

          {type === "client" && (
            <li>
              <Link href={`/clients/${id}/edit`} className={styles.editLink}>
                <Pencil size={16} /> Редактировать
              </Link>
            </li>
          )}

          <div className={styles.deleteSeparator} />

          <li>
            <button onClick={onDeleteClick} className={styles.deleteBtn}>
              <Trash2 size={16} /> Удалить
            </button>
          </li>
        </ul>
      </div>
    </Portal>
  );
}
