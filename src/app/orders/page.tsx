"use client";

import { useEffect, useState } from "react";
import {
  deleteOrderById,
  loadAllOrders,
  updateOrderStatus,
} from "@/services/orderService";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import styles from "./page.module.css";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
import { OrderUI } from "@/types";
import SearchInput from "@/components/SearchInput/SearchInput";
import StatusFilter from "@/components/ui/StatusFilter/StatusFilter";
import {
  ITEMS_PER_PAGE,
  ORDER_PAGE_TITLES,
  ORDER_STATUS_LABELS,
} from "@/constants";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import usePagination from "@/hooks/usePagination";
import { useOrderFilters } from "@/hooks/useOrderFilters";
import OrdersList from "./components/OrdersList";
import EmptyBlock from "@/components/ui/EmptyBlock/EmptyBlock";
import OrdersSkeleton from "./OrdersSkeleton";
import { useMenuAnchor } from "@/components/Portal/useMenuAnchor";
import { LayoutGrid, List } from "lucide-react";

type ViewMode = "table" | "grid";

export default function OrdersListPage() {
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [loading, setLoading] = useState(true);
  const { openMenuId, anchor, toggleMenu, closeMenu } = useMenuAnchor();
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredOrders,
  } = useOrderFilters(orders);

  // стейт для пагинации
  const { currentPage, setCurrentPage, totalPages, currentItems } =
    usePagination({ items: filteredOrders, itemsPerPage: ITEMS_PER_PAGE });

  const orderToDelete = orders.find((o) => o.id === deleteOrderId);

  // 1. Логика формирования динамического заголовка
  const pageTitle = ORDER_PAGE_TITLES[statusFilter] || "Заказы";

  useEffect(() => {
    loadAllOrders()
      .then((data) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteOrderId) return;
    setIsDeleting(true);
    try {
      await deleteOrderById(deleteOrderId);
      setOrders((prev) => prev.filter((o) => o.id !== deleteOrderId));
      toast.success("Заказ удален");
    } catch (err) {
      toast.error("Ошибка при удалении заказа");
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteOrderId(null);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const orderToUpdate = orders.find((o) => o.id === id);
      if (!orderToUpdate) return;

      if (newStatus === "completed") {
        toast.info("Завершение заказа доступно только на его странице");
        return;
      }

      // Обновляем статус в базе (только статус, без цены)
      await updateOrderStatus(id, newStatus);

      // Обновляем локальный стейт
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      );

      toast.success("Статус обновлен");
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при обновлении статуса");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 980) {
        setViewMode("grid");
      }
    };

    handleResize(); // при первом рендере
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <PageWrapper>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{pageTitle}</h1>
          {!loading && (
            <span className={styles.countBadge}>{filteredOrders.length}</span>
          )}
          <div className={styles.searchWrapper}>
            <SearchInput value={searchQuery} setSearch={setSearchQuery} />
          </div>
        </div>
        <div className={styles.headerTools}>
          <StatusFilter
            currentFilter={statusFilter}
            onFilterChange={setStatusFilter}
            labels={ORDER_STATUS_LABELS}
          />
          <div className={styles.viewSwitcher}>
            <button
              onClick={() => setViewMode("table")}
              className={`${styles.viewBtn} ${viewMode === "table" ? styles.activeView : ""}`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`${styles.viewBtn} ${viewMode === "grid" ? styles.activeView : ""}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <OrdersSkeleton />
      ) : filteredOrders.length > 0 ? (
        <>
          <OrdersList
            viewMode={viewMode}
            orders={currentItems}
            openMenuId={openMenuId}
            anchor={anchor}
            onToggleMenu={toggleMenu}
            onClose={closeMenu}
            onStatusUpdate={handleStatusUpdate}
            onDeleteClick={(id) => {
              setDeleteOrderId(id);
              closeMenu(); // Закрываем меню при открытии модалки
            }}
          />

          <PaginationControls
            totalPages={totalPages}
            clickHandler={setCurrentPage}
            currentPage={currentPage}
          />
        </>
      ) : (
        <div className={styles.emptyWrapper}>
          <EmptyBlock message="Заказы не найдены" isSearch={!!searchQuery} />
        </div>
      )}
      <DeleteConfirmModal
        isOpen={!!deleteOrderId}
        onClose={() => setDeleteOrderId(null)}
        onConfirm={handleConfirmDelete}
        itemName={orderToDelete ? `Заказ №${orderToDelete.order_number}` : ""}
        itemType="заказ"
        loading={isDeleting}
      />
    </PageWrapper>
  );
}
