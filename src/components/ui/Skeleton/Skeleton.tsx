// @/components/ui/Skeleton/Skeleton.tsx
import { CSSProperties } from "react";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: CSSProperties; // Добавляем поддержку инлайн-стилей
}

export default function Skeleton({
  width,
  height,
  borderRadius = "4px",
  style,
}: SkeletonProps) {
  return (
    <div
      className={styles.skeleton}
      style={{
        width,
        height,
        borderRadius,
        ...style, // Объединяем базовые стили с переданными
      }}
    />
  );
}
