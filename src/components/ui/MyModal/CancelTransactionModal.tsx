import { AlertTriangle, RotateCw } from "lucide-react";
import ModalLayout from "./ModalLayout";
import styles from "./CancelTransactionModal.module.css";
import { Transaction } from "@/services/financeService";

type CancelTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
  loading?: boolean;
};

export default function CancelTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  loading,
}: CancelTransactionModalProps) {
  if (!transaction) return null;

  const isIncome = transaction.type === "income";
  const isRestoring = transaction.status === "cancelled";

  // Используем вынесенную логику текста
  const labelText = isRestoring
    ? isIncome
      ? "Сумма вернется в доход:"
      : "Сумма снова спишется:"
    : isIncome
      ? "Сумма спишется с баланса:"
      : "Сумма вернется на баланс:";

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      modalTitle={isRestoring ? "Восстановление операции" : "Отмена операции"}
    >
      <div className={styles.confirmWrapper}>
        <div
          className={
            isRestoring ? styles.iconContainerGreen : styles.iconContainerRed
          }
        >
          {isRestoring ? <RotateCw size={48} /> : <AlertTriangle size={48} />}
        </div>

        <div className={styles.messageBlock}>
          <p className={styles.confirmMessage}>
            {isRestoring
              ? "Восстановить эту операцию?"
              : "Подтверждаете отмену?"}
          </p>

          <div className={styles.detailsBox}>
            {/* ТЕПЕРЬ МЫ ИСПОЛЬЗУЕМ labelText ЗДЕСЬ */}
            <span className={styles.amountLabel}>{labelText}</span>
            <strong className={styles.amountValue}>
              {transaction.amount.toLocaleString("ru-RU")} ₽
            </strong>
          </div>
        </div>
      </div>

      <div className={styles.modalActions}>
        <button
          onClick={onConfirm}
          className={isRestoring ? styles.restoreBtnConfirm : styles.confirmBtn}
          disabled={loading}
        >
          {loading
            ? "Обработка..."
            : isRestoring
              ? "Восстановить"
              : "Да, отменить"}
        </button>
        <button onClick={onClose} className={styles.backBtn} disabled={loading}>
          Назад
        </button>
      </div>
    </ModalLayout>
  );
}
