import { useState, useMemo } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../page.module.css";
import { YearlyData } from "@/services/financeService";
import Skeleton from "@/components/ui/Skeleton/Skeleton";

// export interface YearlyData {
//   month_index: number;
//   income: number;
// }

interface YearlyStatCardProps {
  data: YearlyData[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  loading?: boolean;
}

export default function YearlyStatCard({
  data,
  selectedYear,
  onYearChange,
  loading = false,
}: YearlyStatCardProps) {
  const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");

  const totalIncome = useMemo(() => {
    if (selectedMonth === "all") {
      return data.reduce((acc, curr) => acc + curr.income, 0);
    }
    return data.find((d) => d.month_index === selectedMonth)?.income || 0;
  }, [data, selectedMonth]);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeaderSmall}>
        <div
          className={styles.cardIconWrapper}
          style={{
            backgroundColor: "rgba(139, 92, 246, 0.1)", // Светло-фиолетовый фон
            color: "#8b5cf6",
          }}
        >
          <CalendarDays size={24} />
        </div>
        <div className={styles.cardTrend}>
          {loading ? (
            <Skeleton width={100} height={24} borderRadius="6px" />
          ) : (
            <select
              className={styles.miniSelect}
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
            >
              <option value="all">Весь год</option>
              {data.map((m) => (
                <option key={m.month_index} value={m.month_index}>
                  {new Date(0, m.month_index - 1).toLocaleString("ru", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.yearToggleRow}>
          <button
            type="button"
            onClick={() => onYearChange(selectedYear - 1)}
            className={styles.inlineYearBtn}
            disabled={loading}
          >
            <ChevronLeft size={14} />
          </button>
          <h3 className={styles.cardTitle}>
            {loading ? (
              <Skeleton width={120} height={14} />
            ) : (
              `ПРИХОД ЗА ${selectedYear}`
            )}
          </h3>
          <button
            type="button"
            onClick={() => onYearChange(selectedYear + 1)}
            className={styles.inlineYearBtn}
            disabled={loading}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className={styles.cardValue} style={{ color: "#8b5cf6" }}>
          {loading ? (
            <Skeleton width="140px" height={32} style={{ marginTop: "4px" }} />
          ) : (
            <>
              +{totalIncome.toLocaleString("ru-RU")}{" "}
              <span className={styles.cardCurrency}>₽</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
