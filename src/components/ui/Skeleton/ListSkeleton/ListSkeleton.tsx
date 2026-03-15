"use client";

import styles from "./ListSkeleton.module.css";
import { ViewMode } from "@/types";

interface ListSkeletonProps {
  viewMode: ViewMode;
  rows?: number;
}

export default function ListSkeleton({
  viewMode,
  rows = 6,
}: ListSkeletonProps) {
  if (viewMode === "table") {
    return (
      <div className={styles.tableSkeleton}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.tableRow} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.cardsSkeleton}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.card} />
      ))}
    </div>
  );
}
