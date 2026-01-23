"use client";

import { useEffect, useState } from "react";
import {
  deleteOrderById,
  loadAllOrders,
  updateOrderStatus,
} from "@/services/orderService";
import PageWrapper from "@/components/PageWrapper/PageWrapper";

import styles from "./page.module.css";
import { EllipsisVertical } from "lucide-react";
import ActionsMenu from "@/components/ui/ActionsMenu/ActionsMenu";
import { toast } from "sonner";
import { validateOrderStatus } from "@/helpers";
import DeleteConfirmModal from "@/components/ui/MyModal/DeleteConfirmModal";
import { OrderUI } from "@/types";
import SearchInput from "@/components/SearchInput/SearchInput";

export default function OrdersListPage() {
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [loading, setLoading] = useState(true);
  // стейт для поиска
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Стейты для модалки удаления
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const orderToDelete = orders.find((o) => o.id === deleteOrderId);

  // стейт для фильтрации по статусу
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filterLabels: Record<string, string> = {
    all: "Все",
    active: "Активные",
    completed: "Завершенные",
    cancelled: "Отмененные",
  };

  // 1. Логика формирования динамического заголовка
  const getPageTitle = () => {
    const titles: Record<string, string> = {
      all: "Все заказы",
      active: "Активные заказы",
      completed: "Завершенные заказы",
      cancelled: "Отмененные заказы",
    };

    return titles[statusFilter] || "Заказы";
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  // ОБНОВЛЕННАЯ ЛОГИКА ФИЛЬТРАЦИИ
  const filteredOrders = orders.filter((order) => {
    // 1. Сначала фильтруем по статусу
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    // 2. Затем фильтруем по поисковому запросу
    const searchLower = searchQuery.toLowerCase().trim();

    // Если поиск пустой — показываем всё (что прошло фильтр по статусу)
    if (!searchLower) return matchesStatus;

    const matchesSearch =
      // Поиск по номеру заказа
      order.order_number?.toString().includes(searchLower) ||
      // Поиск по телефону клиента
      order.client?.phone?.toLowerCase().includes(searchLower) ||
      // (Опционально) Поиск по фамилии, если нужно
      order.client?.last_name?.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

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

  // Функция для обновления статуса заказа
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      // Вызываем сервис
      await updateOrderStatus(
        id,
        newStatus as "active" | "completed" | "cancelled",
      );

      // Обновляем локальное состояние, чтобы UI изменился мгновенно
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order,
        ),
      );

      toast.success(
        `Заказ переведен в статус: ${newStatus === "completed" ? "Завершен" : "Отменен"}`,
      );
    } catch (error) {
      toast.error("Не удалось обновить статус заказа");
      console.error("Ошибка при обновлении статуса заказа:", error);
    }
  };

  if (loading) return "Загрузка списка заказов...";
  if (orders.length < 1) return "Список заказов пуст";

  const getReturnStatus = (endDate: string, status: string) => {
    if (status !== "active") return { text: "—", className: "" };

    const now = new Date();
    const end = new Date(endDate);

    // Считаем разницу в днях
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `Просрочено: ${Math.abs(diffDays)} дн.`,
        className: styles.overdue,
      };
    } else if (diffDays === 0) {
      return { text: "Сегодня возврат", className: styles.today };
    } else {
      return { text: `Осталось: ${diffDays} дн.`, className: styles.onTime };
    }
  };

  return (
    <PageWrapper>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{getPageTitle()}</h1>
          <span className={styles.countBadge}>{filteredOrders.length}</span>
        </div>

        {/* НОВЫЙ БЛОК УПРАВЛЕНИЯ */}
        <div className={styles.searchWrapper}>
          <SearchInput value={searchQuery} setSearch={setSearchQuery} />
        </div>
        <div className={styles.filters}>
          {["all", "active", "completed", "cancelled"].map((status) => {
            // Определяем динамический класс цвета
            const statusClass =
              status === "active"
                ? styles.statusActive
                : status === "completed"
                  ? styles.statusCompleted
                  : status === "cancelled"
                    ? styles.statusCancelled
                    : "";

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`
          ${styles.filterBtn} 
          ${statusFilter === status ? styles.activeFilter : ""} 
          ${statusFilter === status ? statusClass : ""}
        `}
              >
                {filterLabels[status]}
              </button>
            );
          })}
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>№ </th>
            <th>Статус</th>
            <th>Клиент</th>
            <th>Телефон</th>
            <th>Инструмент</th>
            <th>Статус проката</th>
            <th>Сумма</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => {
            // Получаем текст и класс для статуса один раз
            const statusInfo = validateOrderStatus(order.status);
            // Достаем реальный класс из локального объекта styles
            const statusClass =
              styles[statusInfo.className as keyof typeof styles] || "";

            return (
              <tr key={order.id}>
                <td>{order.order_number}</td>

                {/* 1. Статус отображаем один раз */}
                <td>
                  <span className={`${styles.statusBadge} ${statusClass}`}>
                    {statusInfo.text}
                  </span>
                </td>

                {/* 2. Данные клиента */}
                <td>
                  {order.client?.last_name} {order.client?.first_name}
                </td>

                <td className={styles.phoneCell}>
                  <a
                    href={`tel:${order.client?.phone}`}
                    className={styles.phoneLink}
                  >
                    {order.client?.phone || "—"}
                  </a>
                </td>

                <td>{order.inventory?.name}</td>
                <td>
                  {order.status === "active" ? (
                    <div
                      className={`${styles.returnStatus} ${getReturnStatus(order.end_date, order.status).className}`}
                    >
                      <span className={styles.dateLabel}>
                        до {new Date(order.end_date).toLocaleDateString()}
                      </span>
                      <span className={styles.statusText}>
                        {getReturnStatus(order.end_date, order.status).text}
                      </span>
                    </div>
                  ) : (
                    <span className={styles.dateLabel}>
                      {new Date(order.end_date).toLocaleDateString()}
                    </span>
                  )}
                </td>
                {/* <td>{new Date(order.start_date).toLocaleDateString()}</td> */}
                <td>{order.total_price} руб.</td>

                {/* 3. Действия */}
                <td className={styles.actionsCell}>
                  <button
                    data-menu-trigger={order.id}
                    className={styles.actionButton}
                    onClick={() => toggleMenu(order.id)}
                  >
                    <EllipsisVertical size={16} />
                  </button>

                  {openMenuId === order.id && (
                    <ActionsMenu
                      id={order.id}
                      type="order"
                      currentStatus={order.status}
                      onClose={() => setOpenMenuId(null)}
                      onStatusUpdate={handleStatusUpdate}
                      onDeleteClick={() => {
                        setDeleteOrderId(order.id);
                        setOpenMenuId(null);
                      }}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <DeleteConfirmModal
        isOpen={!!deleteOrderId}
        onClose={() => setDeleteOrderId(null)}
        onConfirm={handleConfirmDelete}
        // Передаем номер заказа для красоты
        itemName={orderToDelete ? `Заказ №${orderToDelete.order_number}` : ""}
        itemType="заказ"
        loading={isDeleting}
      />
    </PageWrapper>
  );
}
