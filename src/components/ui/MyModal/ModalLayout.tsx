"use client";

import { useEffect, useRef } from "react";
import styles from "./MyModal.module.css";

type MyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  children: React.ReactNode;
};

export default function ModalLayout({
  isOpen,
  onClose,
  modalTitle,
  children,
}: MyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose(); // клик по backdrop
        }
      }}
    >
      <div className={styles.modalContent}>
        <header className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{modalTitle}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </header>

        <div className={styles.modalBody}>{children}</div>
      </div>
    </dialog>
  );
}
