"use client";

import { useState, useMemo } from "react";
import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import { useClients } from "@/hooks/useClients";
import usePagination from "@/hooks/usePagination";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import { PlusCircle } from "lucide-react";
import CreateClientModal from "@/components/ui/MyModal/CreateClientModal/CreateClientModal";
import { useMenuAnchor } from "@/components/Portal/useMenuAnchor";
import SearchInput from "@/components/SearchInput/SearchInput";
import ClientsFilters from "@/components/ClientsFilters/ClientsFilters";
import { useFilteredClients } from "@/hooks/useFilteredClients";
import { ClientsStats } from "./components/ClientsStats";
import ClientsTable from "./components/ClientsTable";
import { calculateClientStats } from "@/helpers";
import { useSearchStore } from "../store/store";
import ViewToggle from "@/components/ui/ViewToggle/ViewToggle";
import { useAdaptiveView } from "@/hooks/useAdaptiveView";
import { getClientDisplayName } from "@/helpers/clientUtils";
import { useFinanceData } from "@/hooks/useFinanceData";
import styles from "./page.module.css";
import Spinner from "@/components/ui/Spinner/Spinner";

export default function ClientsPage() {
  const { openMenuId, anchor, toggleMenu, closeMenu } = useMenuAnchor();
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { clients, loading, error, addClient, removeClient } = useClients();
  const { query, setQuery } = useSearchStore();
  const { state: finance, actions: financeActions } = useFinanceData();
  const { viewMode, setViewMode, isMobile } = useAdaptiveView("clients");
  const {
    filtered,
    statusFilter,
    setStatusFilter,
    loyaltyFilter,
    setLoyaltyFilter,
  } = useFilteredClients(clients);

  const {
    currentPage,
    totalPages,
    currentItems: pagedClients,
    pageLoading,
    handlePageChange,
  } = usePagination({ items: filtered, itemsPerPage: 10 });

  const isInitialLoading = loading && clients.length === 0;

  const stats = useMemo(() => calculateClientStats(clients), [clients]);

  const uniqueCompaniesCount = useMemo(() => {
    const set = new Set(
      clients
        .map((c) => {
          if (c.client_type === "legal") {
            return c.company_name;
          }
          return null;
        })
        .filter(Boolean),
    );

    return set.size;
  }, [clients]);

  const handleConfirmDelete = async () => {
    if (!deleteClientId) return;
    const success = await removeClient(deleteClientId);
    if (success) setDeleteClientId(null);
  };

  if (isInitialLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size={22} />
        <span>Загрузка клиентов…</span>
      </div>
    );
  }

  if (error && !clients.length) {
    return <ErrorBlock message={error} />;
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Клиенты</h1>
          <p className={styles.subtitle}>
            Управление базой арендаторов, историей и уровнями лояльности.
          </p>
        </div>
        <div className={styles.btnWrapper}>
          <button
            className={styles.addButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle size={16} />
            <span className={styles.btnText}>Клиент</span>
          </button>
        </div>
      </header>

      <ClientsStats
        stats={stats}
        loading={loading && !clients.length}
        companiesCount={uniqueCompaniesCount}
        companyIncomePercent={finance?.stats?.companyIncomePercent}
      />

      <div className={styles.tableCard}>
        <div className={styles.tableControls}>
          <div className={styles.left}>
            <SearchInput value={query} setSearch={setQuery} />
          </div>
          <div className={styles.right}>
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
            {!isMobile && (
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            )}
          </div>
        </div>
        <div className={pageLoading ? styles.paginationLoading : ""}>
          <ClientsTable
            clients={pagedClients}
            openMenuId={openMenuId}
            anchor={anchor}
            onToggleMenu={toggleMenu}
            onCloseMenu={closeMenu}
            onDelete={(id) => {
              setDeleteClientId(id);
              closeMenu();
            }}
            viewMode={viewMode}
          />
        </div>

        {totalPages > 1 && (
          <div className={styles.paginationFooter}>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              clickHandler={handlePageChange}
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
        itemName={(() => {
          const client = clients.find((c) => c.id === deleteClientId);
          return client ? getClientDisplayName(client) : "";
        })()}
        itemType="клиент"
      />
    </div>
  );
}
