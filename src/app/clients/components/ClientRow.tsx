"use client";

import { User, Phone, Calendar, EllipsisVertical } from "lucide-react";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import styles from "../page.module.css";
import { Client } from "@/types";
import Link from "next/link";

interface ClientRowProps {
  client: Client;
  isMenuOpen: boolean;
  onToggleMenu: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ClientRow({
  client,
  isMenuOpen,
  onToggleMenu,
  onDelete,
}: ClientRowProps) {
  return (
    <tr>
      <td>
        {/* Оборачиваем имя в ссылку для перехода к деталям */}
        <Link href={`/clients/${client.id}`} className={styles.nameLink}>
          <div className={styles.nameCell}>
            <div className={styles.iconWrapper}>
              <User size={16} />
            </div>
            <span className={styles.itemName}>
              {client.last_name} {client.first_name}
            </span>
          </div>
        </Link>
      </td>
      <td>
        <a href={`tel:${client.phone}`} className={styles.phoneLink}>
          <Phone size={14} /> {client.phone || "—"}
        </a>
      </td>
      <td>
        <div className={styles.dateCell}>
          <Calendar size={14} />
          {client.created_at
            ? new Date(client.created_at).toLocaleDateString()
            : "—"}
        </div>
      </td>
      <td className={styles.menuContainer}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => onToggleMenu(client.id)}
        >
          <EllipsisVertical size={18} />
        </button>
        {isMenuOpen && (
          <ActionsMenu
            id={client.id}
            type="client"
            onClose={() => onToggleMenu("")}
            onDeleteClick={() => onDelete(client.id)}
          />
        )}
      </td>
    </tr>
  );
}
