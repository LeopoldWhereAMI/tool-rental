import { CheckCircle2 } from "lucide-react";
import ModalLayout from "./ModalLayout";
import styles from "./MyModal.module.css";

type CompleteOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  finalAmount: number;
  loading?: boolean;
};

export default function CompleteOrderModal({
  isOpen,
  onClose,
  onConfirm,
  finalAmount,
  loading,
}: CompleteOrderModalProps) {
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Завершение заказа"
    >
      <div className={styles.confirmWrapper}>
        <CheckCircle2
          className={styles.successIcon}
          size={48}
          color="#10b981"
        />
        <p className={styles.confirmMessage}>
          Вы закрываете заказ и фиксируете оплату.
          <br />
          <span className={styles.finalAmountLabel}>Сумма к получению:</span>
          <strong className={styles.finalPriceText}>
            {finalAmount.toLocaleString()} ₽
          </strong>
        </p>
      </div>

      <div className={styles.modalActions}>
        <button
          onClick={onConfirm}
          className={styles.completeBtnConfirm}
          disabled={loading}
        >
          {loading ? "Сохранение..." : "Подтвердить получение оплаты"}
        </button>
        <button
          onClick={onClose}
          className={styles.cancelBtn}
          disabled={loading}
        >
          Отмена
        </button>
      </div>
    </ModalLayout>
  );
}
