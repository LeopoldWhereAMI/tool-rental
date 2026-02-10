"use client";

import { useState } from "react";
import FormField from "@/components/Form/FormField/FormField";
import { X } from "lucide-react";
import styles from "../../PassportModal/PassportModal.module.css";
import { CreateClientInput } from "@/types";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateClientInput) => Promise<boolean>;
}

export default function CreateClientModal({
  isOpen,
  onClose,
  onSave,
}: CreateClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateClientInput>({
    last_name: "",
    first_name: "",
    middle_name: "",
    phone: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSave(form);
    setLoading(false);

    if (success) {
      setForm({ last_name: "", first_name: "", middle_name: "", phone: "" });
      onClose();
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Новый клиент</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className={styles.modalGrid}
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            <FormField label="Фамилия" id="last_name">
              <input
                required
                className={styles.input}
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
                placeholder="Иванов"
              />
            </FormField>

            <FormField label="Имя" id="first_name">
              <input
                required
                className={styles.input}
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
                placeholder="Иван"
              />
            </FormField>
          </div>

          <FormField label="Отчество" id="middle_name">
            <input
              className={styles.input}
              value={form.middle_name}
              onChange={(e) =>
                setForm({ ...form, middle_name: e.target.value })
              }
              placeholder="Иванович"
            />
          </FormField>

          <FormField label="Телефон" id="phone">
            <input
              type="tel"
              className={styles.input}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+7 (999) 000-00-00"
            />
          </FormField>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Сохранение..." : "Создать клиента"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
