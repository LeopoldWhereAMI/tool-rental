"use client";

import { Wrench } from "lucide-react";
import ModalLayout from "./ModalLayout";
import styles from "./MyModal.module.css";

type MaintenanceConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function MaintenanceConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: MaintenanceConfirmModalProps) {
  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Техническое обслуживание"
    >
      <div className={styles.confirmWrapper}>
        <Wrench
          className={styles.successIcon} // Используем ваш стиль для иконок
          size={48}
          color="#3b82f6" // Синий цвет для обслуживания
        />
        <p className={styles.confirmMessage}>
          Вы подтверждаете выполнение работ по ТО?
          <br />
          <span className={styles.warningText}>
            Счетчик рабочих дней будет сброшен на ноль.
          </span>
        </p>
      </div>

      <div className={styles.modalActions}>
        <button
          onClick={onConfirm}
          className={styles.completeBtnConfirm} // Используем ваш стиль зеленой кнопки
          disabled={loading}
          style={{ backgroundColor: "#3b82f6" }} // Перекрасим в синий для отличия от оплаты
        >
          {loading ? "Сохранение..." : "Обнулить счетчик и зафиксировать ТО"}
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
