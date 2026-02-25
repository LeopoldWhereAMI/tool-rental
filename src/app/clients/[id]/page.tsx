"use client";

import { useParams } from "next/navigation";
import styles from "./page.module.css";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import ClientDetailsSkeleton from "./ClientDetailsSkeleton";
import ClientSidebar from "./components/ClientSidebar";
import { AlertCircle, AlertTriangle } from "lucide-react";
import ActiveOrders from "./components/ActiveOrders";
import OrdersHistory from "./components/OrdersHistory";
import { useClientDetails } from "@/hooks/useClientDetails";
import PageContainer from "@/components/PageContainer/PageContainer";
import { useMemo } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";

export default function ClientDetailsPage() {
  const { id } = useParams();

  const { client, loading, insights, activeOrders, historyOrders } =
    useClientDetails(id as string);

  const isBlacklisted = client?.is_blacklisted;

  const breadcrumbItems = useMemo(
    () => [
      { label: "Клиенты", href: "/clients" },
      {
        label: (
          <span className={styles.breadcrumbLabelWithIcon}>
            {isBlacklisted && (
              <span className={styles.breadcrumbBlacklistDot}>
                <AlertCircle size={12} strokeWidth={3} />
              </span>
            )}
            {client?.last_name} {client?.first_name}
          </span>
        ),
      },
    ],
    [client, isBlacklisted],
  );

  if (loading) return <ClientDetailsSkeleton />;
  if (!client)
    return <ErrorBlock message="Не удалось загрузить данные клиента" />;

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <div className={styles.headerWrapper}>
          <Breadcrumbs
            items={breadcrumbItems}
            className={styles.breadcrumbLabelWithIcon}
          />
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
    </PageContainer>
  );
}
