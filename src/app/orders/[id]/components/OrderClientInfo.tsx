import { CheckCircle2, Phone } from "lucide-react";
import styles from "../page.module.css";
import { OrderDetailsUI } from "@/types";
import Image from "next/image";
import Link from "next/link";

type OrderClientInfoProps = {
  client: OrderDetailsUI["client"];
};

export default function OrderClientInfo({ client }: OrderClientInfoProps) {
  const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${client?.id || "default"}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    <div className={styles.infoBlock}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>ДЕТАЛИ КЛИЕНТА</span>
      </div>

      <div className={styles.clientProfileCard}>
        <div className={styles.avatarWrapper}>
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={52} // Обязательно указываем размер для Next/Image
            height={52}
            className={styles.avatarImage}
            unoptimized // Для SVG из внешних API оптимизация растром не нужна
          />
        </div>

        <div className={styles.clientMainInfo}>
          <div className={styles.nameRow}>
            <span className={styles.clientName}>
              {client?.first_name} {client?.last_name}
            </span>
            <CheckCircle2 size={16} className={styles.verifiedIcon} />
          </div>
          <span className={styles.memberSince}>
            Клиент с{" "}
            {client?.created_at
              ? new Date(client.created_at).toLocaleDateString("ru-RU", {
                  month: "long",
                  year: "numeric",
                })
              : "2024 г."}
          </span>
        </div>
      </div>

      <div className={styles.contactList}>
        <div className={styles.contactItem}>
          <div className={styles.contactIconBox}>
            <Phone size={14} />
          </div>
          {client?.phone ? (
            <a href={`tel:${client.phone}`} className={styles.contactLink}>
              {client.phone}
            </a>
          ) : (
            <span className={styles.contactValue}>—</span>
          )}
        </div>
      </div>

      <div className={styles.contactBtn}>
        <Link href={`../clients/${client.id}`}>Информация о клиенте</Link>
      </div>
    </div>
  );
}
