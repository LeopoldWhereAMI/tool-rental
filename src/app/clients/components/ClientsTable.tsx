import ClientRow from "./ClientRow";
import ClientsSkeleton from "../ClientsSkeleton";
import styles from "../page.module.css";
import { ClientWithOrders } from "@/types";

interface ClientsTableProps {
  clients: ClientWithOrders[];
  loading: boolean;
  openMenuId: string | null;
  anchor: { top: number; left: number } | null;
  onToggleMenu: (e: React.MouseEvent<HTMLElement>, id: string) => void;
  onCloseMenu: () => void;
  onDelete: (id: string) => void;
}

export default function ClientsTable({
  clients,
  loading,
  openMenuId,
  anchor,
  onToggleMenu,
  onCloseMenu,
  onDelete,
}: ClientsTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Имя клиента</th>
            <th>Контактные данные</th>
            <th>Заказы</th>
            <th>Статус</th>
            <th>Лояльность</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <ClientsSkeleton />
          ) : clients.length > 0 ? (
            clients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                isMenuOpen={openMenuId === client.id}
                anchor={anchor}
                onToggleMenu={onToggleMenu}
                onClose={onCloseMenu}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.emptyCell}>
                Ничего не найдено
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
