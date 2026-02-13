"use client";

import { useState } from "react";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import SearchInput from "@/components/SearchInput/SearchInput";
import styles from "./page.module.css";
import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import ClientsSkeleton from "./ClientsSkeleton";
import ClientRow from "./components/ClientRow";
import { useClients } from "@/hooks/useClients";
import usePagination from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import { Plus } from "lucide-react";
import CreateClientModal from "@/components/ui/MyModal/CreateClientModal/CreateClientModal";
import { useMenuAnchor } from "@/components/Portal/useMenuAnchor";

export default function ClientsPage() {
  const { openMenuId, anchor, toggleMenu, closeMenu } = useMenuAnchor();
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    clients,
    filteredClients,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    addClient,
    removeClient,
  } = useClients();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems: pagedClients,
  } = usePagination({ items: filteredClients, itemsPerPage: 10 });

  if (error && !clients.length) {
    return <ErrorBlock message={error} />;
  }

  // const toggleMenu = (id: string) =>
  //   setOpenMenuId((prev) => (prev === id ? null : id));

  const handleConfirmDelete = async () => {
    if (!deleteClientId) return;
    const success = await removeClient(deleteClientId);
    if (success) {
      setDeleteClientId(null);
    }
  };

  return (
    <PageWrapper>
      <div className={styles.header}>
        <h1 className={styles.title}>Клиенты</h1>
        <div className={styles.headerActions}>
          <SearchInput value={searchQuery} setSearch={setSearchQuery} />
          <button
            className={styles.addButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={18} />
            <span>Добавить клиента</span>
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Клиент</th>
              <th>Телефон</th>
              <th>Дата регистрации</th>
              <th style={{ width: "50px" }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              /* 1. Состояние загрузки */
              <ClientsSkeleton />
            ) : pagedClients.length > 0 ? (
              /* 2. Рендер списка, если клиенты найдены */
              pagedClients.map((client) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  isMenuOpen={openMenuId === client.id}
                  anchor={anchor}
                  onToggleMenu={toggleMenu}
                  onClose={closeMenu}
                  onDelete={(id) => {
                    setDeleteClientId(id);
                    closeMenu();
                  }}
                />
              ))
            ) : (
              /* 3. Состояние "Пусто" */
              <tr>
                <td colSpan={4} className={styles.emptyCell}>
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        // <div className={styles.paginationWrapper}>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          clickHandler={setCurrentPage}
        />
        // </div>
      )}

      <CreateClientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={addClient}
      />

      <DeleteConfirmModal
        isOpen={!!deleteClientId}
        onClose={() => setDeleteClientId(null)}
        onConfirm={handleConfirmDelete}
        itemName={clients.find((c) => c.id === deleteClientId)?.last_name}
        itemType="клиент"
      />
    </PageWrapper>
  );
}
