import styles from "./TrendBadge.module.css";

export default function TrendBadge({
  value,
  invert = false,
}: {
  value: number;
  invert?: boolean;
}) {
  // Вместо скрытия, возвращаем нейтральный вид для 0
  if (value === 0 || isNaN(value)) {
    return (
      <span className={`${styles.statTrend} ${styles.trendNeutral}`}>0%</span>
    );
  }

  const isPositive = value > 0;
  // Для ремонта рост — это плохо (красный), для аренды — хорошо (зеленый)
  const isGood = invert ? !isPositive : isPositive;

  return (
    <span
      className={`${styles.statTrend} ${isGood ? styles.trendPositive : styles.trendNegative}`}
    >
      {isPositive ? "↗" : "↘"} {Math.abs(value)}%
    </span>
  );
}
