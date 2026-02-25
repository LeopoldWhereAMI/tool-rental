import { CSSProperties } from "react";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string; // Добавляем поддержку классов
  style?: CSSProperties;
}

export default function Skeleton({
  width,
  height,
  borderRadius = "4px",
  className = "", // По умолчанию пустая строка
  style,
}: SkeletonProps) {
  return (
    <div
      // Объединяем базовый класс с переданным извне
      className={`${styles.skeleton} ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}
