"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import {
  createWithdrawRequest,
  createTransaction,
} from "@/services/financeService";
import styles from "../page.module.css";
import Skeleton from "@/components/ui/Skeleton/Skeleton";

interface FinanceActionFormProps {
  currentBalance: number;
  onActionComplete?: () => void;
  loading?: boolean;
}

type ActionType = "income" | "expense";

export default function FinanceActionForm({
  currentBalance,
  onActionComplete,
  loading = false,
}: FinanceActionFormProps) {
  const [type, setType] = useState<ActionType>("expense"); // По умолчанию "Вывод"
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const actionAmount = parseFloat(amount);

    // Валидация
    if (!actionAmount || actionAmount <= 0) {
      setMessage({ type: "error", text: "Введите сумму больше нуля" });
      return;
    }

    if (type === "expense" && actionAmount > currentBalance) {
      setMessage({
        type: "error",
        text: `Недостаточно средств. Доступно: ${currentBalance.toLocaleString("ru-RU")} ₽`,
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: null, text: "" });

    try {
      if (type === "expense") {
        await createWithdrawRequest(actionAmount, remarks.trim() || undefined);
      } else {
        // Ручное пополнение
        await createTransaction({
          type: "income",
          amount: actionAmount,
          description: remarks.trim() || "Ручное пополнение кассы",
          category: "Корректировка баланса",
          status: "completed",
        });
      }

      if (onActionComplete) onActionComplete();

      setMessage({
        type: "success",
        text: `✅ ${type === "income" ? "Пополнено на" : "Списано"} ${actionAmount.toLocaleString("ru-RU")} ₽`,
      });

      setAmount("");
      setRemarks("");
    } catch (error) {
      setMessage({
        type: "error",
        text: `❌ Ошибка: ${error instanceof Error ? error.message : "Операция не удалась"}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.withdrawCard}>
      {/* Переключатель вкладок */}
      <div className={styles.tabContainer}>
        {/* Скользящий фон */}
        <div
          className={`
    ${styles.tabIndicator} 
    ${type === "income" ? styles.indicatorIncome : ""}
  `}
        />

        <button
          className={`${styles.tabButton} ${type === "expense" ? styles.tabActiveExpense : ""}`}
          onClick={() => {
            setType("expense");
            setMessage({ type: null, text: "" });
          }}
          type="button"
        >
          <ArrowUpRight size={18} /> Вывод
        </button>

        <button
          className={`${styles.tabButton} ${type === "income" ? styles.tabActiveIncome : ""}`}
          onClick={() => {
            setType("income");
            setMessage({ type: null, text: "" });
          }}
          type="button"
        >
          <ArrowDownLeft size={18} /> Пополнение
        </button>
      </div>

      <p className={styles.withdrawSubtitle}>
        {type === "expense"
          ? "Списание средств из кассы."
          : "Внесение наличных или корректировка баланса."}
      </p>

      {/* Уведомление (ваш существующий блок) */}
      {message.type && (
        <div
          className={styles.messageBox}
          style={{
            backgroundColor:
              message.type === "success"
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
            borderLeft: `4px solid ${message.type === "success" ? "#10b981" : "#ef4444"}`,
          }}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} color="#10b981" />
          ) : (
            <AlertCircle size={18} color="#ef4444" />
          )}
          <span
            style={{
              color: message.type === "success" ? "#10b981" : "#ef4444",
            }}
          >
            {message.text}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>СУММА</label>
          <div className={styles.amountInputWrapper}>
            <span className={styles.currencySymbol}>₽</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className={styles.amountInput}
              disabled={isLoading || loading}
            />
          </div>

          <div className={styles.amountHint}>
            {/* Оставляем условие только внутри, чтобы текст пропадал, а блок оставался */}
            {type === "expense" &&
              (loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Доступно:{" "}
                  <Skeleton width={60} height={14} borderRadius="4px" />
                </div>
              ) : (
                <span>
                  Доступно: {currentBalance.toLocaleString("ru-RU")} ₽
                </span>
              ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>ОПИСАНИЕ</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={
              type === "expense" ? "Причина вывода..." : "Источник средств..."
            }
            className={styles.textarea}
            disabled={isLoading}
            rows={2}
          />
        </div>

        <button
          type="submit"
          className={`${styles.submitBtn} ${type === "income" ? styles.submitBtnIncome : styles.submitBtnExpense}`}
          disabled={isLoading || !amount}
        >
          {type === "income" ? (
            <ArrowDownLeft size={18} />
          ) : (
            <ArrowUpRight size={18} />
          )}
          {isLoading
            ? "Обработка..."
            : type === "income"
              ? "Пополнить кассу"
              : "Вывести средства"}
        </button>
      </form>
    </div>
  );
}
