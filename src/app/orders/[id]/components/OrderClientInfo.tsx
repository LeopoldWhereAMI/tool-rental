import { Phone, User } from "lucide-react";
import styles from "../page.module.css";
import { OrderDetailsUI } from "@/types";

type OrderClientInfoProps = {
  client: OrderDetailsUI["client"];
};

export default function OrderClientInfo({ client }: OrderClientInfoProps) {
  return (
    <div className={styles.infoBlock}>
      <div className={styles.blockTitle}>
        <User size={20} /> <h3>Клиент</h3>
      </div>
      <div className={styles.blockContent}>
        <p className={styles.name}>
          {[client?.last_name, client?.first_name, client?.middle_name]
            .filter(Boolean)
            .join(" ")}
        </p>

        <div className={styles.contactInfo}>
          <div className={styles.contactRow}>
            <Phone size={14} />
            <span>{client?.phone || "Телефон не указан"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
