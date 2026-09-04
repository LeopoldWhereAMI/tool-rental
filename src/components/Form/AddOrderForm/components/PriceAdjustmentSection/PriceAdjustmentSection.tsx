"use client";

import { useEffect, useMemo, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { OrderInput } from "@/lib/validators/orderSchema";
import styles from "./PriceAdjustmentSection.module.css";

type PriceAdjustmentSectionProps = {
  setValue: UseFormSetValue<OrderInput>;
  totalAmount: number;
};

export default function PriceAdjustmentSection({
  setValue,
  totalAmount,
}: PriceAdjustmentSectionProps) {
  const [kind, setKind] = useState<"discount" | "markup">("discount");
  const [mode, setMode] = useState<"fixed" | "percent">("fixed");
  const [inputValue, setInputValue] = useState("");

  const adjustment = useMemo(() => {
    const raw = Number(inputValue) || 0;
    if (raw <= 0) return 0;
    const magnitude = mode === "percent" ? (totalAmount * raw) / 100 : raw;
    return kind === "discount" ? -magnitude : magnitude;
  }, [inputValue, mode, kind, totalAmount]);

  useEffect(() => {
    setValue("price_adjustment", adjustment, { shouldValidate: false });
  }, [adjustment, setValue]);

  return (
    <div className={styles.depositField}>
      <label className={styles.depositLabel}>
        Скидка / наценка
        <span className={styles.depositOptional}>необязательно</span>
      </label>

      <div className={styles.adjustmentToggle}>
        <button
          type="button"
          onClick={() => setKind("discount")}
          className={kind === "discount" ? styles.toggleActive : styles.toggle}
        >
          Скидка
        </button>

        <button
          type="button"
          onClick={() => setKind("markup")}
          className={kind === "markup" ? styles.toggleActive : styles.toggle}
        >
          Наценка
        </button>
      </div>

      <div className={styles.priceAdjustmentInputWrapper}>
        <input
          type="number"
          min="0"
          step="1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.priceAdjustmentInput}
          placeholder="0"
        />

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "fixed" | "percent")}
          className={styles.priceAdjustmentMode}
        >
          <option value="fixed">₽</option>
          <option value="percent">%</option>
        </select>
      </div>

      {adjustment !== 0 && (
        <div
          className={`${styles.priceAdjustmentPreview} ${
            adjustment < 0
              ? styles.priceAdjustmentDiscount
              : styles.priceAdjustmentMarkup
          }`}
        >
          {adjustment > 0 ? "+" : ""}
          {adjustment.toLocaleString("ru-RU")} ₽
        </div>
      )}
    </div>
  );
}
