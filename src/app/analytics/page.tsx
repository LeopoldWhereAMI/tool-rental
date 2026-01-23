"use client";

import { useEffect, useState } from "react";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import styles from "./page.module.css";
import { getAnalyticsData } from "@/services/analyticsService";
import { Banknote, CheckCircle2, CalendarDays } from "lucide-react";

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

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  useEffect(() => {
    setLoading(true);
    // Передаем null, если выбран "Весь год"
    getAnalyticsData(selectedMonth === -1 ? null : selectedMonth, currentYear)
      .then(setData)
      .finally(() => setLoading(false));
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
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className={styles.select}
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
        <div className={styles.center}>Загрузка данных...</div>
      ) : (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div
              className={styles.iconWrapper}
              style={{ backgroundColor: "#ecfdf5" }}
            >
              <Banknote size={24} className={styles.iconRevenue} />
            </div>
            <div className={styles.statInfo}>
              <span>
                Выручка{" "}
                {selectedMonth === -1
                  ? `за ${currentYear} год`
                  : `за ${months[selectedMonth].toLowerCase()}`}
              </span>
              <strong>{data?.totalRevenue.toLocaleString() || 0} ₽</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div
              className={styles.iconWrapper}
              style={{ backgroundColor: "#eff6ff" }}
            >
              <CheckCircle2 size={24} className={styles.iconOrders} />
            </div>
            <div className={styles.statInfo}>
              <span>
                Заказов {selectedMonth === -1 ? "всего за год" : "за месяц"}
              </span>
              <strong>{data?.completedCount || 0}</strong>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
