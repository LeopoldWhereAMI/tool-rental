"use client";

import { FileText, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import styles from "./OrdersKPI.module.css";
import Skeleton from "@/components/ui/Skeleton/Skeleton";

interface OrdersKPIProps {
  total: number;
  active: number;
  overdue: number;
  cancelled: number;
  loading?: boolean;
}

export default function OrdersKPI({
  total,
  active,
  overdue,
  cancelled,
  loading = false,
}: OrdersKPIProps) {
  return (
    <div className={styles.kpiGrid}>
      <KpiCard
        title="Всего заказов"
        value={total}
        icon={<FileText size={20} />}
        loading={loading}
      />
      <KpiCard
        title="Активные аренды"
        value={active}
        icon={<CheckCircle2 size={20} />}
        loading={loading}
      />
      <KpiCard
        title="Просроченные"
        value={overdue}
        variant="critical"
        icon={<AlertTriangle size={20} />}
        loading={loading}
      />
      <KpiCard
        title="Отменённые"
        value={cancelled}
        variant="cancelled"
        icon={<XCircle size={20} />}
        loading={loading}
      />
    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: number;
  variant?: "default" | "critical" | "cancelled";
  icon: React.ReactNode;
  loading: boolean;
}

function KpiCard({
  title,
  value,
  variant = "default",
  icon,
  loading,
}: KpiCardProps) {
  const skeletonBase = "#252d3d";
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>
          {loading ? (
            <Skeleton
              width="60px"
              height="28px"
              style={{ backgroundColor: skeletonBase, marginTop: "4px" }}
            />
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );
}
