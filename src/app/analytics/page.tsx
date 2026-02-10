"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import styles from "./page.module.css";
import { getAnalyticsData } from "@/services/analyticsService";
import { Banknote, CheckCircle2, CalendarDays, TrendingUp } from "lucide-react";
import AnalyticsSkeleton from "./AnalyticsSkeleton";
import { months } from "@/constants";
import StatCard from "./components/StatCard";

export default function AnalyticsPage() {
  const [data, setData] = useState<{
    totalRevenue: number;
    completedCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Автоматическое получение текущего года (в 2026 будет 2026, в 2027 станет 2027)
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );

  // Оборачиваем в useCallback, чтобы функция не пересоздавалась
  const fetchAnalytics = useCallback(
    async (month: number) => {
      setLoading(true);
      try {
        const result = await getAnalyticsData(
          month === -1 ? null : month,
          currentYear,
        );
        setData(result);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    },
    [currentYear],
  );

  useEffect(() => {
    fetchAnalytics(selectedMonth);
  }, [fetchAnalytics, selectedMonth]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = Number(e.target.value);
    setSelectedMonth(newMonth);
    fetchAnalytics(newMonth);
  };

  // Вычисляем средний чек отдельно от рендера
  const averageCheck = useMemo(() => {
    if (!data || data.completedCount === 0) return 0;
    return Math.round(data.totalRevenue / data.completedCount);
  }, [data]);

  const periodLabel = useMemo(() => {
    return selectedMonth === -1
      ? `за ${currentYear} год`
      : `за ${months[selectedMonth].toLowerCase()}`;
  }, [selectedMonth, currentYear]);

  return (
    <PageWrapper>
      <div className={styles.header}>
        {/* Динамический заголовок с текущим годом */}
        <h1 className={styles.title}>Аналитика проката {currentYear}</h1>

        <div className={styles.filterContainer}>
          <CalendarDays size={20} className={styles.filterIcon} />

          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className={styles.select}
            disabled={loading}
          >
            <option value={-1}>Весь {currentYear} год</option>
            <option disabled>──────────</option>
            {months.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <AnalyticsSkeleton />
      ) : (
        <div className={styles.statsGrid}>
          <StatCard
            title={`Выручка ${periodLabel}`}
            value={`${data?.totalRevenue.toLocaleString() || 0} ₽`}
            icon={<Banknote size={24} />}
            iconColor="#10b981"
            bgColor="#ecfdf5"
          />

          <StatCard
            title={`Заказов ${selectedMonth === -1 ? "всего за год" : "за месяц"}`}
            value={data?.completedCount || 0}
            icon={<CheckCircle2 size={24} />}
            iconColor="#3b82f6"
            bgColor="#eff6ff"
          />

          <StatCard
            title="Средний чек"
            value={`${averageCheck.toLocaleString()} ₽`}
            icon={<TrendingUp size={24} />}
            iconColor="#d97706"
            bgColor="#fef3c7"
          />
        </div>
      )}
    </PageWrapper>
  );
}
