"use client";

import styles from "./InventoryTable.module.css";
import { validateCategory, validateStatus } from "@/helpers";
import { EllipsisVertical, Eye, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { InventoryUI } from "@/types";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import Link from "next/link";

type InventoryRowProps = {
  item: InventoryUI;
  openMenuId: string | null;
  anchor: { top: number; left: number } | null;
  toggleMenu: (e: React.MouseEvent, id: string) => void;
  closeMenu: () => void;
  setDeleteItemId: (id: string) => void;
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

export default function InventoryRow({
  item,
  openMenuId,
  anchor,
  toggleMenu,
  closeMenu,
  setDeleteItemId,
}: InventoryRowProps) {
  return (
    <tr>
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
      <td className={styles.colCategory}>
        <span className={styles.categoryBadge}>
          {item.category && validateCategory(item.category)}
        </span>
      </td>

      {/* Status */}
      <td className={styles.colStatus}>
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
          {item.daily_price} ₽ <span className={styles.pricePeriod}>/ сут</span>
        </div>
      </td>

      {/* Availability Visual */}
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

      {/* Actions */}
      <td className={styles.actions}>
        <div className={styles.actionsWrapper}>
          <Link href={`/inventory/${item.id}`} className={styles.viewButton}>
            <Eye size={18} />
          </Link>
          <button
            type="button"
            data-menu-trigger={item.id}
            className={styles.actionButton}
            onClick={(e) => toggleMenu(e, item.id)}
          >
            <EllipsisVertical size={18} />
          </button>
        </div>
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
  );
}
