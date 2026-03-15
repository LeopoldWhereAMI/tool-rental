"use client";

import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import styles from "../page.module.css";
import Skeleton from "@/components/ui/Skeleton/Skeleton";

interface ClientsStatsProps {
  stats: {
    total: number;
    totalTrend: number;
    active: number;
    activeRate: number;
    newThisMonth: number;
    newTrend: number;
  };
  loading?: boolean;
  companiesCount: number;
  companyIncomePercent?: number;
}

export const ClientsStats = ({
  stats,
  loading,
  companiesCount,
  companyIncomePercent,
}: ClientsStatsProps) => {
  const renderTrend = (value: number, description: string) => {
    if (loading)
      return <Skeleton width="100px" height="16px" borderRadius="4px" />;

    const isPositive = value >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const trendClass = isPositive ? styles.trendPositive : styles.trendNegative;

    return (
      <div className={`${styles.trendWrapper} ${trendClass}`}>
        <Icon size={14} />
        <span>
          {isPositive ? `+${value}` : value}% {description}
        </span>
      </div>
    );
  };

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div>
          <p className={styles.statLabel}>Всего клиентов</p>
          {loading ? (
            <Skeleton width="80px" height="32px" style={{ margin: "4px 0" }} />
          ) : (
            <h3 className={styles.statValue}>{stats.total.toLocaleString()}</h3>
          )}
        </div>
        {renderTrend(stats.totalTrend, "рост всей базы")}
      </div>

      <div className={styles.statCard}>
        <div>
          <p className={styles.statLabel}>Активные арендаторы</p>
          {loading ? (
            <Skeleton width="60px" height="32px" style={{ margin: "4px 0" }} />
          ) : (
            <h3 className={styles.statValue}>{stats.active}</h3>
          )}
        </div>
        {loading ? (
          <Skeleton width="100px" height="16px" borderRadius="4px" />
        ) : (
          <div
            className={styles.trendWrapper}
            style={{ color: stats.activeRate < 10 ? "#f59e0b" : "#10b981" }}
          >
            <Activity size={14} />
            <span>{stats.activeRate}% от всей базы</span>
          </div>
        )}
      </div>

      <div className={styles.statCard}>
        <div>
          <p className={styles.statLabel}>Новые в этом месяце</p>
          {loading ? (
            <Skeleton width="70px" height="32px" style={{ margin: "4px 0" }} />
          ) : (
            <h3 className={styles.statValue}>+{stats.newThisMonth}</h3>
          )}
        </div>
        {renderTrend(stats.newTrend, "динамика привлечения")}
      </div>

      <div className={styles.statCard}>
        <div>
          <p className={styles.statLabel}>Компании</p>

          {loading ? (
            <Skeleton width="70px" height="32px" style={{ margin: "4px 0" }} />
          ) : (
            <h3 className={styles.statValue}>{companiesCount}</h3>
          )}
        </div>

        {loading ? (
          <Skeleton width="120px" height="16px" borderRadius="4px" />
        ) : (
          <div
            className={`${styles.trendWrapper} ${
              (companyIncomePercent ?? 0) >= 50
                ? styles.trendPositive
                : styles.trendNegative
            }`}
          >
            {(companyIncomePercent ?? 0) >= 50 ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            <span>
              {companyIncomePercent?.toFixed(1) ?? 0}% от общего дохода
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
