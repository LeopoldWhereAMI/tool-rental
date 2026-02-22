import { XCircle } from "lucide-react";
import ModalLayout from "./ModalLayout";
import styles from "./MyModal.module.css";

type CancelOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber?: string;
  loading?: boolean;
};

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  loading,
}: CancelOrderModalProps) {
  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} modalTitle="Отмена заказа">
      <div className={styles.confirmWrapper}>
        <div className={styles.iconContainer}>
          <XCircle className={styles.cancelIcon} size={48} />
        </div>
        <div className={styles.messageBlock}>
          <p className={styles.confirmMessage}>
            Вы отменяете заказ {orderNumber ? `№${orderNumber}` : ""}.
          </p>
          <div className={styles.amountBox}>
            <span className={styles.finalAmountLabel}>
              Все инструменты вернутся в статус «Доступен».
            </span>
          </div>
        </div>
      </div>

      <div className={styles.modalActions}>
        <button
          onClick={onConfirm}
          className={styles.cancelBtnConfirm}
          disabled={loading}
        >
          {loading ? "Отмена заказа..." : "Да, отменить заказ"}
        </button>
        <button
          onClick={onClose}
          className={styles.cancelBtn}
          disabled={loading}
        >
          Назад
        </button>
      </div>
    </ModalLayout>
  );
}
