"use client";

import { RotateCcw, CheckCircle2 } from "lucide-react";
import ModalLayout from "./ModalLayout";
import styles from "./MyModal.module.css";

type ReturnItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  type: "return" | "cancel";
  loading?: boolean;
};

export default function ReturnItemModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  type,
  loading,
}: ReturnItemModalProps) {
  const isReturn = type === "return";

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      modalTitle={isReturn ? "Прием инструмента" : "Отмена возврата"}
    >
      <div className={styles.confirmWrapper}>
        <div className={styles.iconContainer}>
          {isReturn ? (
            <CheckCircle2 className={styles.successIcon} size={48} />
          ) : (
            <RotateCcw className={styles.warningIcon} size={48} />
          )}
        </div>
        <div className={styles.messageBlock}>
          <p className={styles.confirmMessage}>
            {isReturn
              ? `Вы подтверждаете возврат инструмента:`
              : `Вы хотите вернуть в работу инструмент:`}
          </p>
          <div className={styles.amountBox}>
            <strong className={styles.itemNameText}>{itemName}</strong>
          </div>
          <p className={styles.subMessage}>
            {isReturn
              ? "Статус инструмента в инвентаре изменится на Свободен."
              : "Инструмент снова будет числиться в аренде."}
          </p>
        </div>
      </div>

      <div className={styles.modalActions}>
        <button
          onClick={onConfirm}
          className={
            isReturn ? styles.completeBtnConfirm : styles.cancelReturnBtnConfirm
          }
          disabled={loading}
        >
          {loading
            ? "Обработка..."
            : isReturn
              ? "Принять инструмент"
              : "Вернуть в работу"}
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
