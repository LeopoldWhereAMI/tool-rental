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
}

export const ClientsStats = ({ stats, loading }: ClientsStatsProps) => {
  // Вспомогательная функция для рендеринга строки тренда (для 1-й и 3-й карточки)
  const renderTrend = (value: number) => {
    if (loading)
      return <Skeleton width="100px" height="16px" borderRadius="4px" />;

    const isPositive = value >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const trendClass = isPositive ? styles.trendPositive : styles.trendNegative;

    return (
      <div className={`${styles.trendWrapper} ${trendClass}`}>
        <Icon size={14} />
        <span>{isPositive ? `+${value}` : value}% к прошлому месяцу</span>
      </div>
    );
  };

  return (
    <div className={styles.statsGrid}>
      {/* Всего клиентов */}
      <div className={styles.statCard}>
        <div>
          <p className={styles.statLabel}>Всего клиентов</p>
          {loading ? (
            <Skeleton width="80px" height="32px" style={{ margin: "4px 0" }} />
          ) : (
            <h3 className={styles.statValue}>{stats.total.toLocaleString()}</h3>
          )}
        </div>
        {renderTrend(stats.totalTrend)}
      </div>

      {/* Активные арендаторы */}
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
            style={{ color: stats.activeRate < 10 ? "#ef4444" : "#10b981" }}
          >
            {/* Иконка Activity для индикации активности базы */}
            <Activity size={14} />
            <span>{stats.activeRate}% от всей базы</span>
          </div>
        )}
      </div>

      {/* Новые в этом месяце */}
      <div className={styles.statCard}>
        <div>
          <p className={styles.statLabel}>Новые в этом месяце</p>
          {loading ? (
            <Skeleton width="70px" height="32px" style={{ margin: "4px 0" }} />
          ) : (
            <h3 className={styles.statValue}>+{stats.newThisMonth}</h3>
          )}
        </div>
        {renderTrend(stats.newTrend)}
      </div>
    </div>
  );
};
