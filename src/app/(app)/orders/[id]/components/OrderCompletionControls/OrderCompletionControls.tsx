import { Banknote, CheckCircle, ReceiptText, ShieldCheck } from "lucide-react";
import styles from "./OrderCompletionControls.module.css";

type OrderCompletionControlsProps = {
  totalPrice: number;
  priceAdjustment: number;
  adjustment: number | string;
  onAdjustmentChange: (value: number | string) => void;
  additionalPayment: number;
  securityDeposit: number;
  onComplete: () => void;
  isSubmitting: boolean;
};

export default function OrderCompletionControls({
  totalPrice,
  priceAdjustment,
  adjustment,
  onAdjustmentChange,
  additionalPayment,
  securityDeposit,
  onComplete,
  isSubmitting,
}: OrderCompletionControlsProps) {
  // totalPrice уже содержит первоначальную скидку/наценку
  const rentalPriceBeforeAdjustment = totalPrice - priceAdjustment;

  return (
    <div className={styles.sidebarCard}>
      <div className={styles.blockTitle}>
        <ReceiptText size={20} />
        <h3>Итоговый расчёт</h3>
      </div>

      <div className={styles.prepaidBadge}>
        <CheckCircle size={14} />
        <span>Основная аренда оплачена</span>
      </div>

      {/* Информация о стоимости заказа */}
      <div className={styles.orderSummary}>
        <div className={styles.summaryRow}>
          <span>Стоимость аренды</span>
          <span>{rentalPriceBeforeAdjustment} ₽</span>
        </div>

        {priceAdjustment !== 0 && (
          <div className={styles.summaryRow}>
            <span>{priceAdjustment < 0 ? "Скидка" : "Наценка"}</span>

            <span
              className={
                priceAdjustment < 0 ? styles.discount : styles.surcharge
              }
            >
              {priceAdjustment > 0 ? "+" : ""}
              {priceAdjustment} ₽
            </span>
          </div>
        )}

        <div className={styles.summaryTotal}>
          <span>Итого по заказу</span>
          <strong>{totalPrice} ₽</strong>
        </div>
      </div>

      {/* Залог */}
      {securityDeposit > 0 && (
        <div className={`${styles.depositInfo} ${styles.highlightDeposit}`}>
          <div className={styles.depositInfoLeft}>
            <ShieldCheck size={16} />
            <span>Обеспечительный платёж</span>
          </div>

          <span className={styles.depositInfoAmount}>{securityDeposit} ₽</span>
        </div>
      )}

      {/* Доплата / возврат */}
      <div className={styles.paymentSummary}>
        <p className={styles.totalLabel}>
          {additionalPayment < 0 ? "Сумма к возврату" : "Доплата при возврате"}
        </p>

        <p
          className={`${styles.price} ${
            additionalPayment > 0 ? styles.hasDebt : ""
          }`}
        >
          {additionalPayment} ₽
        </p>
      </div>

      {/* Корректировка при возврате */}
      <div className={styles.adjustmentBlock}>
        <label className={styles.adjLabel}>
          <span>Штраф (+) / Скидка (-)</span>

          <input
            type="number"
            value={adjustment}
            onChange={(e) => onAdjustmentChange(e.target.value)}
            placeholder="0"
            className={styles.adjInput}
          />
        </label>
      </div>

      <button
        className={styles.completeOrderBtn}
        onClick={onComplete}
        disabled={isSubmitting}
      >
        <Banknote size={18} />

        {additionalPayment > 0 ? "Принять доплату и закрыть" : "Закрыть заказ"}
      </button>
    </div>
  );
}
