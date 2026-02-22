"use client";

import { useState, useMemo } from "react";
import styles from "./page.module.css";
import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import { useClients } from "@/hooks/useClients";
import usePagination from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import { UserPlus } from "lucide-react";
import CreateClientModal from "@/components/ui/MyModal/CreateClientModal/CreateClientModal";
import { useMenuAnchor } from "@/components/Portal/useMenuAnchor";
import SearchInput from "@/components/SearchInput/SearchInput";
import ClientsFilters from "@/components/ClientsFilters/ClientsFilters";

import { useFilteredClients } from "@/hooks/useFilteredClients";
import { ClientsStats } from "./components/ClientsStats";
import ClientsTable from "./components/ClientsTable";
import { calculateClientStats } from "@/helpers";
import ClientsPageSkeleton from "./ClientsSkeleton";
import { useHeaderStore } from "../store/store";

export default function ClientsPage() {
  const { openMenuId, anchor, toggleMenu, closeMenu } = useMenuAnchor();
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { clients, loading, error, addClient, removeClient } = useClients();
  const { query, setQuery } = useHeaderStore();
  const {
    filtered,
    statusFilter,
    setStatusFilter,
    loyaltyFilter,
    setLoyaltyFilter,
  } = useFilteredClients(clients);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems: pagedClients,
  } = usePagination({ items: filtered, itemsPerPage: 10 });

  const stats = useMemo(() => calculateClientStats(clients), [clients]);

  const handleConfirmDelete = async () => {
    if (!deleteClientId) return;
    const success = await removeClient(deleteClientId);
    if (success) setDeleteClientId(null);
  };

  if (error && !clients.length) {
    return <ErrorBlock message={error} />;
  }

  return (
    <div className={styles.pageContainer}>
      {/* HEADER SECTION */}
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Клиенты</h1>
          <p className={styles.subtitle}>
            Управление базой арендаторов, историей и уровнями лояльности.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.addButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <UserPlus size={18} />
            <span>Добавить клиента</span>
          </button>
        </div>
      </header>

      <ClientsStats stats={stats} loading={loading && !clients.length} />

      {/* TABLE SECTION */}
      <div className={styles.tableCard}>
        <div className={styles.tableControls}>
          <SearchInput value={query} setSearch={setQuery} />

          <ClientsFilters
            status={statusFilter}
            loyalty={loyaltyFilter}
            onStatusChange={setStatusFilter}
            onLoyaltyChange={setLoyaltyFilter}
            onReset={() => {
              setStatusFilter("all");
              setLoyaltyFilter("all");
              setQuery("");
            }}
          />
        </div>
        {loading && !clients.length ? (
          <ClientsPageSkeleton />
        ) : (
          <ClientsTable
            clients={pagedClients}
            loading={loading}
            openMenuId={openMenuId}
            anchor={anchor}
            onToggleMenu={toggleMenu}
            onCloseMenu={closeMenu}
            onDelete={(id) => {
              setDeleteClientId(id);
              closeMenu();
            }}
          />
        )}

        {totalPages > 1 && (
          <div className={styles.paginationFooter}>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              clickHandler={setCurrentPage}
            />
          </div>
        )}
      </div>

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
    </div>
  );
}
