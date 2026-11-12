import { ReactNode } from "react";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "./FinanceCard.module.css";

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
      <div className={`${styles.cardIconWrapper} ${variantClasses[variant]}`}>
        <div style={{ color: iconColor, display: "flex" }}>{icon}</div>
      </div>

      {trend && !loading && (
        <div className={`${styles.cardTrend} ${trendClass}`}>{trend}</div>
      )}

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>

        <div className={styles.cardValue}>
          {loading ? (
            <div className={styles.valueLoading}>
              <Spinner />
            </div>
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
