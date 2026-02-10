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
// import { calculateFinalAmount } from "@/helpers";
// import { processOrderMaintenance } from "@/services/inventoryService";

export default function OrdersListPage() {
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const toggleMenu = (id: string) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

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

  // const handleStatusUpdate = async (id: string, newStatus: string) => {
  //   try {
  //     const orderToUpdate = orders.find((o) => o.id === id);
  //     if (!orderToUpdate) return;

  //     let finalPrice = orderToUpdate.total_price;

  //     if (newStatus === "completed") {
  //       finalPrice = calculateFinalAmount(orderToUpdate);

  //       await processOrderMaintenance(orderToUpdate);
  //     }

  //     // 2. ОБНОВЛЯЕМ СТАТУС И ЦЕНУ В БАЗЕ
  //     await updateOrderStatus(id, newStatus, finalPrice);

  //     // 3. ОБНОВЛЯЕМ ЛОКАЛЬНЫЙ СТЕЙТ
  //     setOrders((prev) =>
  //       prev.map((o) =>
  //         o.id === id
  //           ? { ...o, status: newStatus, total_price: finalPrice }
  //           : o,
  //       ),
  //     );

  //     toast.success(
  //       newStatus === "completed"
  //         ? `Заказ завершен. Пробег обновлен. Итого: ${finalPrice} ₽`
  //         : "Статус обновлен",
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Ошибка обновления");
  //   }
  // };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const orderToUpdate = orders.find((o) => o.id === id);
      if (!orderToUpdate) return;

      // Если статус "Выполнен", мы просто предупреждаем пользователя.
      // Это предотвращает вызов функций расчета, которых здесь больше нет.
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

  return (
    <PageWrapper>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{pageTitle}</h1>
          {!loading && (
            <span className={styles.countBadge}>{filteredOrders.length}</span>
          )}
        </div>

        <div className={styles.searchWrapper}>
          <SearchInput value={searchQuery} setSearch={setSearchQuery} />
        </div>

        <StatusFilter
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
          labels={ORDER_STATUS_LABELS}
        />
      </div>

      {loading ? (
        <OrdersSkeleton />
      ) : filteredOrders.length > 0 ? (
        <>
          <OrdersList
            orders={currentItems}
            openMenuId={openMenuId}
            onToggleMenu={toggleMenu}
            onStatusUpdate={handleStatusUpdate}
            onDeleteClick={(id) => setDeleteOrderId(id)}
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
