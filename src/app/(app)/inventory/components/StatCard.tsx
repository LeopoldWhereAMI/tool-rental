"use client";

import { LucideIcon } from "lucide-react";
import styles from "../page.module.css";
import Skeleton from "@/components/ui/Skeleton/Skeleton";

interface StatCardProps {
  label: string;
  labelColor?: string;
  value: number | string | undefined;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  loading: boolean;
}

export default function StatCard({
  label,
  labelColor,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  loading,
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
      </div>

      <div className={styles.statContent}>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue} style={{ color: labelColor }}>
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
