import React from "react";
import { Loader2, Printer } from "lucide-react";
import styles from "./PrintLoadingOverlay.module.css";

interface Props {
  isVisible: boolean;
}

export const PrintLoadingOverlay = ({ isVisible }: Props) => {
  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <Printer className={styles.printerIcon} size={32} />
          <Loader2 className={styles.spinner} size={48} />
        </div>
        <h3 className={styles.title}>Подготовка документа</h3>
        <p className={styles.subtitle}>
          Генерируем договор и формируем область печати...
        </p>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} />
        </div>
      </div>
    </div>
  );
};
