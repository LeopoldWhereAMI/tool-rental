"use client";

import { Phone } from "lucide-react";
import styles from "../page.module.css";
import { ClientWithOrders } from "@/types";

interface ClientSidebarProps {
  client: ClientWithOrders;
  totalSpent: number;
}

export default function ClientSidebar({
  client,
  totalSpent,
}: ClientSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileCard}>
        <div className={styles.avatarLarge}>
          {client.last_name?.[0] || "?"}
          {client.first_name?.[0] || ""}
        </div>
        <div className={styles.clientName}>
          <p className={styles.name}>
            {`${client.last_name} ${client.first_name} ${client.middle_name}`}
          </p>
        </div>
        <div className={styles.contactInfo}>
          <a href={`tel:${client.phone}`} className={styles.phoneLink}>
            <Phone size={18} /> {client.phone || "Нет телефона"}
          </a>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Всего заказов</span>
          <span className={styles.statValue}>{client.orders?.length || 0}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Общая сумма</span>
          <span className={styles.statValue}>{totalSpent} ₽</span>
        </div>
      </div>
    </aside>
  );
}
