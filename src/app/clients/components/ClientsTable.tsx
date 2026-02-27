"use client";

import ClientRow from "./ClientRow";

import styles from "../page.module.css";
import { ClientWithOrders, ViewMode } from "@/types";
import ClientCard from "./ClientCard";
import EmptyBlock from "@/components/ui/EmptyBlock/EmptyBlock";
import MainSceleton from "@/components/ui/Skeleton/MainSceleton";

interface ClientsTableProps {
  clients: ClientWithOrders[];
  viewMode: ViewMode;
  loading: boolean;
  openMenuId: string | null;
  anchor: { top: number; left: number } | null;
  onToggleMenu: (e: React.MouseEvent<HTMLElement>, id: string) => void;
  onCloseMenu: () => void;
  onDelete: (id: string) => void;
}

export default function ClientsTable({
  clients,
  viewMode,
  loading,
  openMenuId,
  anchor,
  onToggleMenu,
  onCloseMenu,
  onDelete,
}: ClientsTableProps) {
  // Общие пропсы для строк и карточек
  const commonProps = {
    anchor,
    onClose: onCloseMenu,
    onDelete,
    onToggleMenu: (e: React.MouseEvent<HTMLElement>, id: string) =>
      onToggleMenu(e, id),
  };

  // 1. Обработка загрузки (скелетон на весь контент)
  if (loading && clients.length === 0) {
    return (
      <div
        className={
          viewMode === "table" ? styles.tableWrapper : styles.cardsContainer
        }
      >
        <MainSceleton />
      </div>
    );
  }

  // 2. Обработка пустого состояния
  if (clients.length === 0) {
    return <EmptyBlock isSearch={true} message="Клиенты не найдены" />;
  }

  // 3. Основная логика рендеринга
  const renderContent = () => {
    if (viewMode === "table") {
      return (
        <div className={styles.tableContainer}>
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
                {clients.map((client) => (
                  <ClientRow
                    key={client.id}
                    client={client}
                    isMenuOpen={openMenuId === client.id}
                    {...commonProps}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Режим карточек
    return (
      <div className={styles.cardsContainer}>
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            isMenuOpen={openMenuId === client.id}
            {...commonProps}
          />
        ))}
      </div>
    );
  };

  return <div className={styles.viewWrapper}>{renderContent()}</div>;
}
