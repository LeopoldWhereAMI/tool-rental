import { Loader2, Printer, X } from "lucide-react";
import styles from "./PrintLoadingOverlay.module.css";

interface Props {
  isVisible: boolean;
  onCancel?: () => void;
}

export const PrintLoadingOverlay = ({ isVisible, onCancel }: Props) => {
  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <button
          className={styles.closeButton}
          onClick={onCancel}
          aria-label="Закрыть"
          type="button"
        >
          <X size={18} />
        </button>

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

        <button
          className={styles.cancelButton}
          onClick={onCancel}
          type="button"
        >
          Отмена
        </button>
      </div>
    </div>
  );
};
