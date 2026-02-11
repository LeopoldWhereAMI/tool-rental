"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { getClientById } from "@/services/clientsService";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import BackButton from "@/components/BackButton/BackButton";
import styles from "./page.module.css";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import ClientDetailsSkeleton from "./ClientDetailsSkeleton";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import usePagination from "@/hooks/usePagination";
import OrderCard from "./components/OrderCard";
import ClientSidebar from "./components/ClientSidebar";
import SearchInput from "@/components/SearchInput/SearchInput";
import { ClientWithOrders } from "@/types";

export default function ClientDetailsPage() {
  const { id } = useParams();
  const [client, setClient] = useState<ClientWithOrders | null>(null);
  const [loading, setLoading] = useState(true);
  // Состояния для поиска и пагинации
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (id) {
      getClientById(id as string)
        .then(setClient)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Фильтрация и сортировка ПО НОМЕРУ ЗАКАЗА
  const filteredOrders = useMemo(() => {
    if (!client?.orders) return [];

    return (
      client.orders
        .filter((order) =>
          order.order_number?.toString().includes(searchQuery.toLowerCase()),
        )
        // Сортировка по номеру (самый большой номер вверху)
        .sort((a, b) => {
          return Number(b.order_number) - Number(a.order_number);
        })
    );
  }, [client, searchQuery]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems: currentOrders,
  } = usePagination({ items: filteredOrders, itemsPerPage: 5 });

  if (loading) return <ClientDetailsSkeleton />;

  if (!client)
    return <ErrorBlock message="Не удалось загрузить данные клиента" />;

  const totalSpent =
    client.orders?.reduce(
      (sum: number, order) => sum + (order.total_price || 0),
      0,
    ) || 0;

  return (
    <PageWrapper>
      <BackButton href="/clients" />

      <div className={styles.container}>
        {/* Левая колонка */}
        <ClientSidebar client={client} totalSpent={totalSpent} />

        {/* Правая колонка */}
        <div className={styles.content}>
          <div className={styles.historyHeader}>
            <h2 className={styles.sectionTitle}>История заказов</h2>

            <SearchInput
              value={searchQuery}
              setSearch={setSearchQuery}
              placeholder="Поиск по №..."
            />
          </div>

          <div className={styles.ordersList}>
            {currentOrders.length > 0 ? (
              <>
                {currentOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}

                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  clickHandler={setCurrentPage}
                />
              </>
            ) : (
              <div className={styles.emptyOrders}>
                {searchQuery
                  ? "Заказы с таким номером не найдены"
                  : `У ${client.last_name} ${client.first_name} еще нет заказов`}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
