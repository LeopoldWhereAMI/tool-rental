"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import styles from "./ContractSample.module.css";

export default function ContractEditorPage() {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Загрузка текущего шаблона
  useEffect(() => {
    fetch("/api/contract-template")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHtmlContent(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  // Сохранение шаблона
  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/contract-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html_content: htmlContent }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Шаблон успешно сохранен!");
      } else {
        setMessage("❌ Ошибка: " + data.error);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Ошибка сети");
    } finally {
      setIsSaving(false);
    }
  };

  // Откат к предыдущей версии
  const handleRestore = async () => {
    if (!confirm("Вы уверены, что хотите откатиться к предыдущей версии?"))
      return;

    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/contract-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Шаблон восстановлен! Обновляю страницу...");
        window.location.reload(); // Простой способ подтянуть восстановленный шаблон
      } else {
        setMessage("❌ Ошибка: " + data.error);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Ошибка сети");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Загрузка редактора...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.title}>
          <h1>Редактор шаблона договора</h1>
          <p>Настройте внешний вид вашего документа</p>
        </div>

        <div className={styles.actions}>
          {message && (
            <span
              className={`${styles.message} ${message.includes("✅") ? styles.messageSuccess : styles.messageError}`}
            >
              {message}
            </span>
          )}

          <button
            onClick={handleRestore}
            className={`${styles.btn} ${styles.btnRestore}`}
            disabled={isSaving}
          >
            Откатить версию
          </button>

          <button
            onClick={handleSave}
            className={`${styles.btn} ${styles.btnSave}`}
            disabled={isSaving}
          >
            {isSaving ? "Сохранение..." : "Сохранить шаблон"}
          </button>
        </div>
      </header>

      <div className={styles.editorWrapper}>
        <Editor
          height="100%"
          defaultLanguage="html"
          value={htmlContent}
          onChange={(value) => setHtmlContent(value || "")}
          options={{
            wordWrap: "on",
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
          }}
        />
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerSection}>
          <h3>Доступные переменные</h3>
          <div className={styles.variableList}>
            {["order_number", "last_name", "first_name", "total_price"].map(
              (v) => (
                <span key={v} className={styles.variableTag}>{`{{${v}}}`}</span>
              ),
            )}
          </div>
        </div>
        <div className={styles.footerSection}>
          <h3>Инструкция по циклам</h3>
          <p className={styles.codeExample}>
            Используйте <code>{`{{#each items}}`}</code> для списков. <br />
            Пример: <code>{`{{this.name}}`}</code> внутри блока.
          </p>
        </div>
      </footer>
    </div>
  );
}
