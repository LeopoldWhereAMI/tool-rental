"use client";

import styles from "./MaintenanceProgress.module.css";

type MaintenanceProgressProps = {
  current: number;
  interval: number;
  onReset: () => void;
};

export default function MaintenanceProgress({
  current,
  interval,
  onReset,
}: MaintenanceProgressProps) {
  // Вычисляем процент (защита от деления на 0 и переполнения)
  const maxInterval = interval > 0 ? interval : 1;
  const percentage = Math.min(Math.round((current / maxInterval) * 100), 100);

  // Логика выбора цвета
  let color = "#4caf50"; // Зеленый (ОК)
  if (percentage >= 90) {
    color = "#ef4444"; // Красный (Критично)
  } else if (percentage >= 70) {
    color = "#f59e0b"; // Оранжевый (Внимание)
  }

  return (
    <div className={styles.maintenanceWrapper}>
      <div className={styles.maintenanceHeader}>
        <span className={styles.label}>Тех. обслуживание</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            onReset();
          }}
          className={styles.resetBtn}
          title="Сбросить счетчик после проведения работ"
        >
          Обнулить
        </button>
      </div>

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
