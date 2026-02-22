import { OrderUI } from "@/types";
import { History } from "lucide-react";
import OrderCard from "./OrderCard";
import SearchInput from "@/components/SearchInput/SearchInput";
import PaginationControls from "@/components/ui/PaginationControls/PaginationControls";
import usePagination from "@/hooks/usePagination";
import { useMemo, useState } from "react";
import styles from "../page.module.css";

interface OrdersHistoryProps {
  orders: OrderUI[];
  clientName: string;
}

export default function OrdersHistory({
  orders,
  clientName,
}: OrdersHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.order_number?.toString().includes(searchQuery.toLowerCase()),
    );
  }, [orders, searchQuery]);

  const { currentPage, setCurrentPage, totalPages, currentItems } =
    usePagination({ items: filteredOrders, itemsPerPage: 5 });

  return (
    <section className={styles.sectionBlock}>
      <div className={styles.historyHeader}>
        <h2 className={styles.sectionTitle}>
          <History size={20} className={styles.titleIcon} /> История заказов
        </h2>
        <SearchInput
          value={searchQuery}
          setSearch={setSearchQuery}
          placeholder="Поиск по №..."
        />
      </div>

      <div className={styles.ordersList}>
        {currentItems.length > 0 ? (
          <>
            {currentItems.map((order) => (
              <OrderCard key={order.id} order={order} variant="list" />
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
              ? "Заказы не найдены"
              : `У ${clientName} еще нет завершенных заказов`}
          </div>
        )}
      </div>
    </section>
  );
}
