"use client";

import styles from "./MaintenanceProgress.module.css";

type MaintenanceProgressProps = {
  current: number;
  interval: number;
};

export default function MaintenanceProgress({
  current,
  interval,
}: MaintenanceProgressProps) {
  const maxInterval = interval > 0 ? interval : 1;
  const percentage = Math.min(Math.round((current / maxInterval) * 100), 100);

  // Логика выбора цвета
  let color = "#4caf50";
  if (percentage >= 90) {
    color = "#ef4444";
  } else if (percentage >= 70) {
    color = "#f59e0b";
  }

  return (
    <div className={styles.maintenanceWrapper}>
      <div className={styles.maintenanceHeader}></div>

      <div className={styles.progressBarBg}>
        <div
          className={styles.progressBarFill}
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>

      <div className={styles.maintenanceFooter}>
        <span>
          {current} из {interval} дн. работы
        </span>
        <span style={{ color: percentage >= 90 ? color : "inherit" }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
}
