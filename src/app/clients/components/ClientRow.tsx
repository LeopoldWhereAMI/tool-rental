"use client";

import { User, Phone, Calendar, EllipsisVertical } from "lucide-react";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import styles from "../page.module.css";
import { Client } from "@/types";
import Link from "next/link";

interface ClientRowProps {
  client: Client;
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
          data-menu-trigger={client.id}
          className={styles.actionButton}
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
      </td>
    </tr>
  );
}
