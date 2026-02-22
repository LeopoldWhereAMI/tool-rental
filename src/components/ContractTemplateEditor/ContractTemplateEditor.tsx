// src/components/ContractTemplateEditor/ContractTemplateEditor.tsx

"use client";

import { useState } from "react";
import { Edit2, Save, X, RotateCcw } from "lucide-react";
import styles from "./ContractTemplateEditor.module.css";

interface ContractTemplateEditorProps {
  onSave?: () => void;
}

export default function ContractTemplateEditor({
  onSave,
}: ContractTemplateEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [html, setHtml] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const openEditor = async () => {
    try {
      const response = await fetch("/api/contract-template");
      const data = await response.json();
      if (data.success) {
        setHtml(data.data);
        setIsOpen(true);
      }
    } catch (err) {
      setError("Не удалось загрузить шаблон");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/contract-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html_content: html }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Ошибка при сохранении");
      }

      setSuccess("✓ Договор сохранён");
      setTimeout(() => {
        setIsOpen(false);
        setSuccess("");
        onSave?.();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при сохранении");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestore = async () => {
    if (!confirm("Откатить договор к предыдущей версии?")) return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/contract-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error);

      setSuccess("✓ Договор восстановлен");
      setTimeout(() => openEditor(), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при откате");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={openEditor}
        className={styles.editBtn}
        title="Редактировать шаблон договора"
      >
        <Edit2 size={18} />
        Редактировать договор
      </button>

      {isOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.header}>
              <h2>Редактор договора проката</h2>
              <button
                onClick={() => setIsOpen(false)}
                className={styles.closeBtn}
              >
                <X size={24} />
              </button>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className={styles.textarea}
              placeholder="HTML договора..."
            />

            <div className={styles.footer}>
              <button
                onClick={handleRestore}
                className={styles.restoreBtn}
                disabled={isSaving}
              >
                <RotateCcw size={16} />
                Откатить
              </button>

              <div className={styles.spacer} />

              <button
                onClick={() => setIsOpen(false)}
                className={styles.cancelBtn}
              >
                Закрыть
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className={styles.saveBtn}
              >
                <Save size={16} />
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
