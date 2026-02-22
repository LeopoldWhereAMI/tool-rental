"use client";

import {
  Phone,
  Calendar,
  Pencil,
  ShieldAlert,
  UserCheck,
  UserX,
} from "lucide-react";
import styles from "../page.module.css";
import { ClientWithOrders } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useBlacklist } from "@/hooks/useBlacklist";
import BlacklistModal from "@/components/ui/MyModal/BlacklistModal";

interface ClientSidebarProps {
  client: ClientWithOrders;
  totalSpent: number;
  insights: {
    reliability: number;
    onTimeRate: number;
    loyalty: {
      text: string;
      className: string;
      variant: string;
    };
  };
}

export default function ClientSidebar({
  client,
  totalSpent,
  insights,
}: ClientSidebarProps) {
  const {
    isModalOpen,
    openBlacklistModal,
    closeBlacklistModal,
    addToBlacklist,
    removeFromBlacklist,
    loading,
  } = useBlacklist();
  const { loyalty } = insights;
  const isBlacklisted = client.is_blacklisted;
  const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${client.id}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  const joinDate = client.created_at
    ? new Date(client.created_at).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "12 марта 2022";

  return (
    <aside className={styles.sidebar}>
      {/* --- Карточка профиля --- */}
      <div className={styles.profileCard}>
        <div>
          <Link
            href={`/clients/${client.id}/edit`}
            className={styles.editButton}
            title="Редактировать"
          >
            <Pencil size={16} />
          </Link>
        </div>
        <div className={styles.profileHeader}>
          <div>
            <div className={styles.avatarWrapper}>
              <Image
                src={avatarUrl}
                alt="avatar"
                width={80}
                height={80}
                className={styles.avatarImage}
                unoptimized
              />
            </div>
          </div>
          <div className={styles.profileTexts}>
            <h2 className={styles.name}>
              {client.last_name} {client.first_name}
              {isBlacklisted && (
                <span className={styles.statusBlacklistedBadge}>
                  Заблокирован
                </span>
              )}
            </h2>
          </div>
          <span
            className={`${styles.loyaltyBadge} ${styles[loyalty.className]}`}
          >
            {loyalty.text}
          </span>
        </div>

        <div className={styles.contactList}>
          <div className={styles.contactItem}>
            <Phone size={16} className={styles.titleIcon} />
            <div className={styles.contactInfo}>
              <p>Телефон</p>
              <span>{client.phone}</span>
            </div>
          </div>

          <div className={styles.contactItem}>
            <Calendar size={16} className={styles.titleIcon} />
            <div className={styles.contactInfo}>
              <p>В клубе с</p>
              <span>{joinDate}</span>
            </div>
          </div>
        </div>
        <div className={styles.blacklistActionWrapper}>
          {isBlacklisted ? (
            <button
              className={styles.unblacklistBtn}
              onClick={() => removeFromBlacklist(client.id)}
              disabled={loading}
            >
              <UserCheck size={16} />
              Разблокировать
            </button>
          ) : (
            <button
              className={styles.blacklistBtn}
              onClick={() => openBlacklistModal(client.id)}
            >
              <UserX size={16} />В чёрный список
            </button>
          )}
        </div>
      </div>

      {isBlacklisted && (
        <div className={styles.blockingReasonCard}>
          <div className={styles.blockingReasonTitle}>
            <ShieldAlert size={14} />
            Причина блокировки
          </div>
          <p className={styles.blockingReasonText}>
            {client.blacklist_reason || "Причина не указана."}
          </p>
        </div>
      )}

      {/* --- Блок Аналитики (Insights) --- */}
      <div className={styles.insightsCard}>
        <h3 className={styles.sidebarTitle}>Аналитика</h3>

        <div className={styles.statsRow}>
          <div className={styles.miniStat}>
            <span className={styles.statLabel}>Выручка</span>
            <span className={styles.statValue}>
              {totalSpent.toLocaleString()} ₽
            </span>
          </div>
          <div className={styles.miniStat}>
            <span className={styles.statLabel}>Заказов</span>
            <span className={styles.statValue}>
              {client.orders?.length || 0}
            </span>
          </div>
        </div>
      </div>
      <BlacklistModal
        isOpen={isModalOpen}
        onClose={closeBlacklistModal}
        onConfirm={(reason) => addToBlacklist(client.id, reason)}
        clientName={`${client.first_name} ${client.last_name}`}
        loading={loading}
      />
    </aside>
  );
}
