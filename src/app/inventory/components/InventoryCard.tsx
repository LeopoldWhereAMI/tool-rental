"use client";

import styles from "./InventoryTable.module.css";
import { validateCategory, validateStatus } from "@/helpers";
import { EllipsisVertical, Eye, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { InventoryUI } from "@/types";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import Link from "next/link";

type InventoryCardProps = {
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

export default function InventoryCard({
  item,
  openMenuId,
  anchor,
  toggleMenu,
  closeMenu,
  setDeleteItemId,
}: InventoryCardProps) {
  return (
    <div className={styles.card}>
      {/* Header: Image + Article + Actions */}
      <div className={styles.cardHeader}>
        {/* Image Thumbnail - Left */}
        <div className={styles.cardImageThumbnail}>
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              unoptimized
              style={{ objectFit: "cover" }}
              className={styles.cardImageThumb}
            />
          ) : (
            <div className={styles.cardImageThumbPlaceholder}>
              <ImageIcon size={18} color="#64748b" />
            </div>
          )}
        </div>

        {/* Article - Center */}
        <div className={styles.cardArticleBlock}>
          <span className={styles.cardArticleLabel}>Артикул</span>
          <p className={styles.cardProductId}>
            {item.article || item.serial_number}
          </p>
        </div>

        {/* Actions - Right */}
        <div className={styles.cardActions}>
          <Link href={`/inventory/${item.id}`} className={styles.cardViewBtn}>
            <Eye size={18} />
          </Link>
          <button
            data-menu-trigger={item.id}
            className={styles.cardMenuBtn}
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
              type="inventory"
            />
          )}
        </div>
      </div>

      {/* Product Name - Below Header */}
      <h3 className={styles.cardProductName}>{item.name}</h3>

      {/* Category & Status Section */}
      <div className={styles.cardSection}>
        <div className={styles.cardBadges}>
          <span className={styles.cardCategoryBadge}>
            {item.category && validateCategory(item.category)}
          </span>
          {item.status && (
            <span
              className={`${styles.cardStatusBadge} ${getStatusClass(
                item.status,
              )}`}
            >
              <span className={styles.statusDot}></span>
              {validateStatus(item.status)}
            </span>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className={styles.cardSection}>
        <span className={styles.cardSectionLabel}>Цена</span>
        <div className={styles.cardPrice}>
          {item.daily_price} ₽
          <span className={styles.cardPricePeriod}> / сут</span>
        </div>
      </div>

      {/* Availability Section */}
      <div className={styles.cardSection}>
        <span className={styles.cardSectionLabel}>Наличие</span>
        <div className={styles.cardAvailability}>
          <span className={styles.cardAvailabilityRatio}>
            {item.status === "available" ? "1/1" : "0/1"}
          </span>
          <div className={styles.cardProgressBar}>
            <div
              className={styles.cardProgressBarFill}
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
      </div>
    </div>
  );
}
