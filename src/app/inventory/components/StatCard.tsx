"use client";

import { LucideIcon } from "lucide-react";
import styles from "../page.module.css";
import Skeleton from "@/components/ui/Skeleton/Skeleton";
import TrendBadge from "@/components/ui/TrendBadge/TrendBadge";

interface StatCardProps {
  label: string;
  value: number | string | undefined;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  loading: boolean;
  trend?: number;
  invertTrend?: boolean;
  suffix?: string; // Например, "% от общего"
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  loading,
  trend,
  invertTrend,
  suffix,
}: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div
          className={styles.statIconWrapper}
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} color={iconColor} />
        </div>

        {loading ? (
          <Skeleton width="42px" height="20px" borderRadius="4px" />
        ) : (
          <>
            {trend !== undefined && (
              <TrendBadge value={trend} invert={invertTrend} />
            )}
            {suffix && !trend && (
              <span className={styles.statLabelSuffix}>{suffix}</span>
            )}
          </>
        )}
      </div>

      <div className={styles.statContent}>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue}>
          {loading ? (
            <Skeleton width="60%" height="28px" style={{ marginTop: "4px" }} />
          ) : (
            value?.toLocaleString()
          )}
        </div>
      </div>
    </div>
  );
}
