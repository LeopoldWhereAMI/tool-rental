import { ReactNode } from "react";
import styles from "../page.module.css";
import Skeleton from "@/components/ui/Skeleton/Skeleton";

interface FinanceCardProps {
  title: string;
  value: string;
  currency?: string;
  subtext?: string;
  trend?: string;
  icon: ReactNode;
  iconColor: string;
  variant: "blue" | "green" | "orange";
  loading?: boolean;
}

export default function FinanceCard({
  title,
  value,
  currency,
  subtext,
  trend,
  icon,
  iconColor,
  variant,
  loading = false,
}: FinanceCardProps) {
  const variantClasses = {
    blue: styles.wrapperBlue,
    green: styles.wrapperGreen,
    orange: styles.wrapperOrange,
  };

  const trendClass = trend?.startsWith("-")
    ? styles.trendNegative
    : styles.trendPositive;

  return (
    <div className={styles.card}>
      {/* Icon Wrapper */}
      <div className={`${styles.cardIconWrapper} ${variantClasses[variant]}`}>
        <div style={{ color: iconColor, display: "flex" }}>{icon}</div>
      </div>

      {/* Trend */}
      {trend && !loading && (
        <div className={`${styles.cardTrend} ${trendClass}`}>{trend}</div>
      )}
      {loading && trend && (
        <div className={styles.cardTrend}>
          <Skeleton width={35} height={18} borderRadius="4px" />
        </div>
      )}

      {/* Content */}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>

        <div className={styles.cardValue}>
          {loading ? (
            <Skeleton width="120px" height={32} />
          ) : (
            <>
              {value}
              {currency && (
                <span className={styles.cardCurrency}>{currency}</span>
              )}
            </>
          )}
        </div>

        {subtext && <p className={styles.cardSubtext}>{subtext}</p>}
      </div>
    </div>
  );
}
