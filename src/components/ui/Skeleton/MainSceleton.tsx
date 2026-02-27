"use client";

import Skeleton from "@/components/ui/Skeleton/Skeleton";
import styles from "./Skeleton.module.css";

export default function MainSceleton() {
  return (
    <div className={styles.skeletonWrapper}>
      {/* 2. Пустая область контента (просто забиваем высоту) */}
      <div className={styles.skeletonContentArea}>
        {/* Рисуем просто 6-8 нейтральных полосок, которые не похожи ни на таблицу, ни на карты */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.skeletonGhostRow}>
            <Skeleton width="100%" height="50px" borderRadius="8px" />
          </div>
        ))}
      </div>
    </div>
  );
}
