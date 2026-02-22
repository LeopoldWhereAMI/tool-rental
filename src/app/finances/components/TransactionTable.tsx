import { Transaction } from "@/services/financeService";
import { CircleDot, RotateCcw, RotateCw } from "lucide-react";
import styles from "../page.module.css";
import TransactionTableSkeleton from "./TransactionTableSkeleton";

interface TransactionTableProps {
  transactions: Transaction[];
  onCancel: (id: string) => void;
  loading?: boolean;
}

const TYPE_CONFIG = {
  income: { label: "Доход", color: "#10b981", prefix: "+" },
  expense: { label: "Расход", color: "#ef4444", prefix: "-" },
};

export default function TransactionTable({
  transactions,
  onCancel,
  loading = false,
}: TransactionTableProps) {
  if (loading) {
    return <TransactionTableSkeleton rows={5} />;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th>ДАТА И ВРЕМЯ</th>
            <th>ОПИСАНИЕ</th>
            <th>ТИП</th>
            <th>СУММА</th>
            <th style={{ textAlign: "right" }}>ДЕЙСТВИЕ</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const isCancelled = transaction.status === "cancelled";
            const type = TYPE_CONFIG[transaction.type];
            const displayColor = isCancelled ? "#92a0c9" : type.color;

            return (
              <tr
                key={transaction.id}
                className={`${styles.tableRow} ${isCancelled ? styles.rowCancelled : ""}`}
              >
                {/* Дата и время */}
                <td className={styles.tableCell}>
                  <div className={styles.dateBlock}>
                    <div className={styles.dateMain}>
                      {new Date(transaction.created_at).toLocaleDateString(
                        "ru-RU",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </div>
                    <div className={styles.dateTime}>
                      {new Date(transaction.created_at).toLocaleTimeString(
                        "ru-RU",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </div>
                  </div>
                </td>

                {/* Описание (номер заказа) */}
                <td className={styles.tableCell}>
                  <div className={styles.descriptionBlock}>
                    <div className={styles.descriptionMain}>
                      {transaction.description.includes(":")
                        ? transaction.description.split(":")[0]
                        : transaction.description}
                    </div>
                    {isCancelled && (
                      <span className={styles.cancelledBadge}>Отменена</span>
                    )}
                  </div>
                </td>

                {/* Тип */}
                <td className={styles.tableCell}>
                  <span
                    className={styles.typeBadge}
                    style={{ color: type.color }}
                  >
                    <CircleDot size={8} fill={type.color} />
                    {type.label}
                  </span>
                </td>

                {/* Сумма */}
                <td className={styles.tableCell}>
                  <span
                    className={styles.amountText}
                    style={{ color: isCancelled ? "#64748b" : displayColor }}
                  >
                    {type.prefix}
                    {transaction.amount.toLocaleString("ru-RU", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    ₽
                  </span>
                </td>

                <td className={styles.tableCell} style={{ textAlign: "right" }}>
                  {isCancelled ? (
                    /* Кнопка ВОССТАНОВЛЕНИЯ */
                    <button
                      onClick={() => onCancel(transaction.id)} // Механика та же — открываем модалку
                      className={styles.restoreBtn}
                      title="Восстановить операцию"
                    >
                      <RotateCw size={16} />
                    </button>
                  ) : (
                    /* Кнопка ОТМЕНЫ */
                    <button
                      onClick={() => onCancel(transaction.id)}
                      className={styles.cancelBtn}
                      title="Отменить операцию"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
