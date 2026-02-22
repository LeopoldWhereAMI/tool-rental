"use client";

import { useParams } from "next/navigation";
import styles from "./page.module.css";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import ClientDetailsSkeleton from "./ClientDetailsSkeleton";
import ClientSidebar from "./components/ClientSidebar";
import { AlertCircle, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";
import ActiveOrders from "./components/ActiveOrders";
import OrdersHistory from "./components/OrdersHistory";
import { useClientDetails } from "@/hooks/useClientDetails";

export default function ClientDetailsPage() {
  const { id } = useParams();

  const { client, loading, insights, activeOrders, historyOrders } =
    useClientDetails(id as string);

  const isBlacklisted = client?.is_blacklisted;

  if (loading) return <ClientDetailsSkeleton />;
  if (!client)
    return <ErrorBlock message="Не удалось загрузить данные клиента" />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerWrapper}>
        <nav className={styles.breadcrumbs}>
          <Link href="/clients" className={styles.breadcrumbLink}>
            Клиенты
          </Link>
          <ChevronRight size={14} className={styles.breadcrumbSeparator} />
          <span className={styles.breadcrumbCurrent}>
            {/* Добавляем дот перед именем */}
            {isBlacklisted && (
              <span className={styles.breadcrumbBlacklistDot}>
                <AlertCircle size={12} strokeWidth={3} />
              </span>
            )}
            {client.last_name} {client.first_name}
          </span>
        </nav>
      </div>

      <div className={styles.container}>
        <div className={styles.mainContent}>
          {isBlacklisted && (
            <div className={styles.blacklistBanner}>
              <div className={styles.blacklistIconWrapper}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className={styles.blacklistBannerTitle}>
                  Аккаунт заблокирован
                </h4>
                <p className={styles.blacklistBannerText}>
                  Этот клиент находится в чёрном списке. Смотри причину
                  блокировки в боковой панели.
                </p>
              </div>
            </div>
          )}
          <ActiveOrders orders={activeOrders} />
          <OrdersHistory
            orders={historyOrders}
            clientName={`${client.last_name} ${client.first_name}`}
          />
        </div>

        {/* ПРАВАЯ КОЛОНКА: Сайдбар (Профиль + Инсайты) */}
        <div className={styles.sidebarWrapper}>
          <ClientSidebar
            client={client}
            totalSpent={insights.totalSpent || 0}
            insights={insights}
          />
        </div>
      </div>
    </div>
  );
}
