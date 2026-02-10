"use client";

import styles from "./MyModal.module.css";
import { AlertTriangle } from "lucide-react"; // Добавим иконку для акцента
import ModalLayout from "./ModalLayout";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  loading?: boolean;
  itemType?: "инструмент" | "заказ" | "объект" | "клиент";
};

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  loading,
  itemType = "объект",
}: DeleteConfirmModalProps) {
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Подтверждение удаления"
    >
      <div className={styles.confirmWrapper}>
        <AlertTriangle className={styles.warningIcon} size={32} />
        <p className={styles.confirmMessage}>
          Вы действительно хотите удалить {itemType}
          <br />
          <strong>{itemName || "выбранный объект"}</strong>?
          <span className={styles.warningText}>
            Это действие нельзя будет отменить.
          </span>
        </p>
      </div>

      <div className={styles.modalActions}>
        <button
          onClick={onConfirm}
          className={styles.deleteBtnConfirm}
          disabled={loading}
        >
          {loading ? "Удаление..." : "Удалить"}
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
