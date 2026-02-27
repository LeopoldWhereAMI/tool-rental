"use client";

import { useEffect, useState } from "react";
import {
  deleteOrderById,
  loadAllOrders,
  updateOrderStatus,
} from "@/services/orderService";
import styles from "./page.module.css";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
import { OrderUI } from "@/types";
import { ITEMS_PER_PAGE, ORDER_STATUS_LABELS } from "@/constants";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import usePagination from "@/hooks/usePagination";
import { useOrderFilters } from "@/hooks/useOrderFilters";
import EmptyBlock from "@/components/ui/EmptyBlock/EmptyBlock";

import { useMenuAnchor } from "@/components/Portal/useMenuAnchor";
import OrdersKPI from "./components/OrdersKPI/OrdersKPI";
import OrdersToolbar from "./components/OrdersToolbar/OrdersToolbar";
import OrdersTable from "./components/OrdersTable/OrdersTable";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { calculateReturnStatus, getActualEndDate } from "@/helpers";
import CancelOrderModal from "@/components/ui/MyModal/CancelOrderModal";
import { onOrderRefunded } from "@/helpers/financeIntegration";
import { useSearchStore } from "../store/store";
import { useAdaptiveView } from "@/hooks/useAdaptiveView";
import MainSceleton from "@/components/ui/Skeleton/MainSceleton";

export default function OrdersListPage() {
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [loading, setLoading] = useState(true);
  const { query, resetSearch } = useSearchStore();
  const { viewMode, setViewMode, isMobile } = useAdaptiveView("orders");
  const { openMenuId, anchor, toggleMenu, closeMenu } = useMenuAnchor();
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cancelModal, setCancelModal] = useState<{
    id: string;
    orderNumber: string;
  } | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // фильтры
  const { statusFilter, setStatusFilter, filteredOrders } = useOrderFilters(
    orders,
    query,
  );

  // пагинация
  const { currentPage, setCurrentPage, totalPages, currentItems } =
    usePagination({
      items: filteredOrders,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  const orderToDelete = orders.find((o) => o.id === deleteOrderId);

  const ordersWithComputedStatus = orders.map((order) => {
    const endDate = getActualEndDate(order as OrderUI);
    const timeStatus = calculateReturnStatus(endDate, order.status || "");

    return {
      ...order,
      computedType: timeStatus.type,
    };
  });

  // 2. ИТОГОВЫЕ KPI
  const total = orders.length;
  const active = orders.filter((o) => o.status === "active").length;
  const overdue = ordersWithComputedStatus.filter(
    (o) => o.computedType === "overdue",
  ).length;

  const cancelled = orders.filter((o) => o.status === "cancelled").length;

  useEffect(() => {
    loadAllOrders()
      .then((data) => setOrders(data))
      .finally(() => setLoading(false));

    return () => resetSearch();
  }, [resetSearch]);

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

      if (newStatus === "cancelled") {
        setCancelModal({ id, orderNumber: orderToUpdate.order_number });
        return;
      }

      await updateOrderStatus(id, newStatus);

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      );

      toast.success("Статус обновлен");
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при обновлении статуса");
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelModal) return;
    setIsCancelling(true);

    try {
      const orderToCancel = orders.find((o) => o.id === cancelModal.id);

      await updateOrderStatus(cancelModal.id, "cancelled");
      if (orderToCancel) {
        await onOrderRefunded(orderToCancel.id, orderToCancel.total_price);
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === cancelModal.id ? { ...o, status: "cancelled" } : o,
        ),
      );
      toast.success("Заказ отменён");
      setCancelModal(null);
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при отмене заказа");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Заголовок */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Заказы и бронирования</h1>
          <span className={styles.subtitle}>
            Управляйте новыми заявками, контролируйте сроки и статус оплаты.
          </span>
        </div>
        <div>
          <Link
            href="/orders/add"
            className={`${styles.btn} ${styles.primary}`}
          >
            <PlusCircle size={18} />
            <span className={styles.btnText}>
              <span className={styles.btnTextHidden}>Создать</span> заказ
            </span>
          </Link>
        </div>
      </div>

      <OrdersKPI
        total={total}
        active={active}
        overdue={overdue}
        cancelled={cancelled}
        loading={loading}
      />
      <div className={styles.tableCard}>
        {/* Панель инструментов */}
        <OrdersToolbar
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
          labels={ORDER_STATUS_LABELS}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isMobile={isMobile}
        />

        {/* Скелетон */}
        {loading && <MainSceleton />}

        {/* Пусто */}
        {!loading && filteredOrders.length === 0 && (
          <div className={styles.emptyWrapper}>
            <EmptyBlock message="Заказы не найдены" isSearch={!!query} />
          </div>
        )}

        {/* Таблица */}
        {!loading && filteredOrders.length > 0 && (
          <>
            <OrdersTable
              orders={currentItems}
              openMenuId={openMenuId}
              anchor={anchor}
              onToggleMenu={toggleMenu}
              onClose={closeMenu}
              onStatusUpdate={handleStatusUpdate}
              onDeleteClick={(id) => {
                setDeleteOrderId(id);
                closeMenu();
              }}
              viewMode={viewMode}
            />

            <PaginationControls
              totalPages={totalPages}
              clickHandler={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        )}
      </div>
      <CancelOrderModal
        isOpen={!!cancelModal}
        onClose={() => setCancelModal(null)}
        onConfirm={handleCancelConfirm}
        orderNumber={cancelModal?.orderNumber}
        loading={isCancelling}
      />

      <DeleteConfirmModal
        isOpen={!!deleteOrderId}
        onClose={() => setDeleteOrderId(null)}
        onConfirm={handleConfirmDelete}
        itemName={orderToDelete ? `Заказ №${orderToDelete.order_number}` : ""}
        itemType="заказ"
        loading={isDeleting}
      />
    </div>
  );
}
