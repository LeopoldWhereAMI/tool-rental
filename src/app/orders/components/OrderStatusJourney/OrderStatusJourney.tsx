import React from "react";
import styles from "./OrderStatusJourney.module.css";
import { Check, RefreshCcw, Package, XCircle } from "lucide-react";

interface JourneyProps {
  status: string;
  dates: {
    start: string;
    end: string;
  };
}

export const OrderStatusJourney = ({ status, dates }: JourneyProps) => {
  const isCancelled = status === "cancelled";

  const steps = [
    {
      id: "reserved",
      label: "Забронирован",
      date: dates.start,
      icon: <Check size={14} />,
    },
    {
      id: "active",
      label: "В работе",
      date: dates.start,
      icon: (
        <RefreshCcw size={14} className={!isCancelled ? styles.spin : ""} />
      ),
    },
    {
      id: "completed",
      label: isCancelled ? "Заказ отменён" : "Возвращен",
      date: dates.end,
      icon: isCancelled ? <XCircle size={14} /> : <Package size={14} />,
    },
  ];

  const getStepStatus = (stepId: string) => {
    // Если заказ завершен нормально
    if (status === "completed") return "completed";

    if (isCancelled) {
      // Для отмененного заказа: первые два шага синие (completed), последний — красный
      if (stepId === "completed") return "cancelled";
      return "completed";
    }

    // Обычная логика для активного/забронированного
    if (status === "active") {
      if (stepId === "reserved") return "completed";
      if (stepId === "active") return "current";
    }
    if (status === "reserved" && stepId === "reserved") return "current";

    return "upcoming";
  };

  return (
    <div
      className={`${styles.journeyContainer} ${isCancelled ? styles.isCancelled : ""}`}
    >
      {/* Линия-трек */}
      <div className={styles.lineTrack}>
        {/* Прогресс линии: 0% для reserved, 50% для active, 100% для completed */}
        <div
          className={styles.lineProgress}
          style={{
            width: isCancelled
              ? "100%"
              : status === "completed"
                ? "100%"
                : status === "active"
                  ? "50%"
                  : "0%",
          }}
        />
      </div>

      <div className={styles.steps}>
        {steps.map((step) => {
          const stepStatus = getStepStatus(step.id);
          const isCurrent = stepStatus === "current";

          return (
            <div
              key={step.id}
              className={`${styles.step} ${styles[stepStatus]}`}
            >
              <div className={styles.node}>
                {stepStatus === "completed" ? (
                  <Check size={14} strokeWidth={3} />
                ) : stepStatus === "cancelled" ? (
                  step.icon
                ) : isCurrent ? (
                  step.icon
                ) : (
                  <div className={styles.dot} />
                )}
              </div>

              <div className={styles.content}>
                <span className={styles.label}>{step.label}</span>
                {!isCurrent && (
                  <span className={styles.dateText}>
                    {stepStatus === "upcoming"
                      ? "Ожидается"
                      : new Date(step.date).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "short",
                        })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
