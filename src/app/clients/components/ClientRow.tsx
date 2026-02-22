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

interface ClientRowProps {
  client: ClientWithOrders;
  isMenuOpen: boolean;
  onToggleMenu: (e: React.MouseEvent<HTMLElement>, id: string) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  anchor: { top: number; left: number } | null;
}

export default function ClientRow({
  client,
  isMenuOpen,
  onToggleMenu,
  onClose,
  onDelete,
  anchor,
}: ClientRowProps) {
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
    <tr className={`${styles.row} ${isBlocked ? styles.rowBlacklisted : ""}`}>
      {/* 1. Имя клиента */}
      <td>
        <div className={styles.nameCell}>
          <div
            className={`${styles.avatarWrapper} ${
              isBlocked ? styles.avatarBlocked : ""
            }`}
          >
            <Image
              src={avatarUrl}
              alt="avatar"
              width={40}
              height={40}
              className={styles.avatarImage}
              unoptimized
            />
          </div>
          <div className={styles.nameInfo}>
            <div className={styles.nameHeaderWrapper}>
              {isBlocked && (
                <AlertCircle
                  size={14}
                  className={styles.blacklistAlert}
                  strokeWidth={2.5}
                />
              )}
              <Link
                href={`/clients/${client.id}`}
                className={`${styles.itemName} ${
                  isBlocked ? styles.blockedName : ""
                }`}
              >
                {client.last_name} {client.first_name}
              </Link>
            </div>
            <p className={styles.subText}>В базе с {yearSince}</p>
          </div>
        </div>
      </td>

      {/* 2. Контактные данные */}
      <td>
        <div className={styles.contactCell}>
          <a href={`tel:${client.phone}`} className={styles.contactPhone}>
            {client.phone || "—"}
          </a>
        </div>
      </td>

      {/* 3. Заказы */}
      <td>
        <div className={styles.ordersCell}>
          <div className={styles.totalOrders}>
            {totalOrders} {getOrderPlural(totalOrders)}
          </div>
          <div
            className={`${styles.activeOrders} ${
              activeOrdersCount > 0 ? styles.hasActive : styles.noActive
            }`}
          >
            {activeOrdersCount > 0
              ? `${activeOrdersCount} активно`
              : "Нет активных"}
          </div>
        </div>
      </td>

      {/* 4. Статус */}
      <td>
        {isBlocked ? (
          <span className={styles.statusBlacklistedBadge}>
            <AlertTriangle size={14} strokeWidth={2.5} />
            Заблокирован
          </span>
        ) : (
          <span
            className={`${styles.statusBadge} ${
              activeOrdersCount > 0 ? styles.statusActive : styles.statusIdle
            }`}
          >
            {activeOrdersCount > 0 ? "Активный" : "Ожидание"}
          </span>
        )}
      </td>

      {/* 5. Лояльность */}
      <td>
        <span className={`${styles.loyaltyBadge} ${styles[loyalty.className]}`}>
          {loyalty.text}
        </span>
      </td>

      {/* 6. Действия */}
      <td className={styles.actionsCell}>
        <div className={styles.actionsWrapper}>
          <Link href={`/clients/${client.id}`} className={styles.viewButton}>
            <Eye size={18} />
          </Link>
          <button
            type="button"
            data-menu-trigger={client.id}
            className={styles.actionButton}
            onClick={(e) => onToggleMenu(e, client.id)}
          >
            <EllipsisVertical size={18} />
          </button>
        </div>

        {isMenuOpen && (
          <ActionsMenu
            id={client.id}
            type="client"
            anchor={anchor}
            onClose={onClose}
            onDeleteClick={() => onDelete(client.id)}
          />
        )}
      </td>
    </tr>
  );
}
