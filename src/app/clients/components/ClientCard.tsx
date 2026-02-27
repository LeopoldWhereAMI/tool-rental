"use client";

import {
  AlertCircle,
  AlertTriangle,
  EllipsisVertical,
  Eye,
} from "lucide-react";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import styles from "../page.module.css";
import { ClientWithOrders } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { getLoyaltyInfo, getOrderPlural } from "@/helpers";

interface ClientCardProps {
  client: ClientWithOrders;
  isMenuOpen: boolean;
  onToggleMenu: (e: React.MouseEvent<HTMLElement>, id: string) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  anchor: { top: number; left: number } | null;
}

export default function ClientCard({
  client,
  isMenuOpen,
  onToggleMenu,
  onClose,
  onDelete,
  anchor,
}: ClientCardProps) {
  const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${client.id}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  const isBlocked = client.is_blacklisted;
  const totalOrders = client.orders?.length || 0;
  const activeOrdersCount =
    client.orders?.filter((o) => o.status === "active").length || 0;

  const loyalty = getLoyaltyInfo(totalOrders);
  const yearSince = client.created_at
    ? new Date(client.created_at).getFullYear()
    : "2026";

  return (
    <div
      className={`${styles.card} ${isBlocked ? styles.cardBlacklisted : ""}`}
    >
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.cardAvatarBlock}>
          <div
            className={`${styles.cardAvatarWrapper} ${
              isBlocked ? styles.cardAvatarBlocked : ""
            }`}
          >
            <Image
              src={avatarUrl}
              alt="avatar"
              width={48}
              height={48}
              className={styles.cardAvatarImage}
              unoptimized
            />
          </div>
          <div className={styles.cardNameBlock}>
            <div className={styles.cardNameHeaderWrapper}>
              {isBlocked && (
                <AlertCircle
                  size={14}
                  className={styles.cardBlacklistAlert}
                  strokeWidth={2.5}
                />
              )}
              <Link
                href={`/clients/${client.id}`}
                className={`${styles.cardItemName} ${
                  isBlocked ? styles.cardBlockedName : ""
                }`}
              >
                {client.last_name} {client.first_name}
              </Link>
            </div>
            <p className={styles.cardSubText}>В базе с {yearSince}</p>
          </div>
        </div>

        <div className={styles.cardActions}>
          <Link href={`/clients/${client.id}`} className={styles.cardViewBtn}>
            <Eye size={18} />
          </Link>
          <button
            data-menu-trigger={client.id}
            className={styles.cardMenuBtn}
            onClick={(e) => onToggleMenu(e, client.id)}
          >
            <EllipsisVertical size={18} />
          </button>
          {isMenuOpen && (
            <ActionsMenu
              id={client.id}
              type="client"
              anchor={anchor}
              onClose={onClose}
              onDeleteClick={() => onDelete(client.id)}
            />
          )}
        </div>
      </div>

      {/* Contact */}
      <div className={styles.cardSection}>
        <span className={styles.cardSectionLabel}>Контакт</span>
        <a href={`tel:${client.phone}`} className={styles.cardContactPhone}>
          {client.phone || "—"}
        </a>
      </div>

      {/* Orders */}
      <div className={styles.cardSection}>
        <span className={styles.cardSectionLabel}>Заказы</span>
        <div className={styles.cardOrdersInfo}>
          <div className={styles.cardTotalOrders}>
            {totalOrders} {getOrderPlural(totalOrders)}
          </div>
          <div
            className={`${styles.cardActiveOrders} ${
              activeOrdersCount > 0 ? styles.cardHasActive : styles.cardNoActive
            }`}
          >
            {activeOrdersCount > 0
              ? `${activeOrdersCount} активно`
              : "Нет активных"}
          </div>
        </div>
      </div>

      {/* Status & Loyalty */}
      <div className={styles.cardFooter}>
        <div>
          {isBlocked ? (
            <span className={styles.cardStatusBlacklistedBadge}>
              <AlertTriangle size={14} strokeWidth={2.5} />
              Заблокирован
            </span>
          ) : (
            <span
              className={`${styles.cardStatusBadge} ${
                activeOrdersCount > 0
                  ? styles.cardStatusActive
                  : styles.cardStatusIdle
              }`}
            >
              {activeOrdersCount > 0 ? "Активный" : "Ожидание"}
            </span>
          )}
        </div>
        <span
          className={`${styles.cardLoyaltyBadge} ${styles[loyalty.className]}`}
        >
          {loyalty.text}
        </span>
      </div>
    </div>
  );
}
