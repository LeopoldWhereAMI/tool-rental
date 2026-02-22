"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import ModalLayout from "./ModalLayout";
import styles from "./MyModal.module.css";

type BlacklistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  clientName?: string;
  loading?: boolean;
};

export default function BlacklistModal({
  isOpen,
  onClose,
  onConfirm,
  clientName,
  loading,
}: BlacklistModalProps) {
  const [reason, setReason] = useState("");

  // Очищаем локально и закрываем
  const handleCancel = () => {
    setReason("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason(""); // Очищаем после успешного вызова
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={handleCancel} // Используем нашу функцию сброса
      modalTitle="Блокировка клиента"
    >
      <div className={styles.confirmWrapper}>
        <ShieldAlert className={styles.blacklistIcon} size={48} />
        <p className={styles.confirmMessage}>
          Вы вносите клиента{" "}
          <strong>{clientName || "этого пользователя"}</strong> в чёрный список.
        </p>

        <div className={styles.inputField}>
          <label htmlFor="blacklistReason" className={styles.label}>
            Причина блокировки (необязательно)
          </label>
          <textarea
            id="blacklistReason"
            className={styles.textarea}
            placeholder="Можно оставить пустым..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className={styles.modalActions}>
        <button
          onClick={handleConfirm}
          className={styles.blacklistBtnConfirm}
          disabled={loading}
        >
          {loading ? "Блокировка..." : "Заблокировать"}
        </button>
        <button
          onClick={handleCancel} // Используем нашу функцию сброса
          className={styles.cancelBtn}
          disabled={loading}
        >
          Отмена
        </button>
      </div>
    </ModalLayout>
  );
}
