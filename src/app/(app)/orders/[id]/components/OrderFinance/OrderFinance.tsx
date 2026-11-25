"use client";

import { OrderDetailsUI } from "@/types";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import { useEffect, useState } from "react";
import OrderExtension from "../OrderExtension/OrderExtension";
import OrderExtensionsList from "../OrderExtension/OrderExtensionsList";
import { calculateUnpaidExtensions } from "./helper";
import styles from "./OrderFinance.module.css";
import { CalendarClock, ChevronDown } from "lucide-react";

type OrderFinanceProps = {
  totalPrice: number;
  order: OrderDetailsUI;
  adjustment: number | string;
  additionalPayments: number;
  onFinanceUpdate?: (data: {
    finalAmount: number;
    additionalPayment: number;
    adjustment: number;
    debtAmount: number;
  }) => void;
};

export default function OrderFinance({
  totalPrice,
  order,
  adjustment,
  additionalPayments,
  onFinanceUpdate,
}: OrderFinanceProps) {
  const { debtAmount } = useOrderStatusInfo(order);
  const [extensions, setExtensions] = useState(order.extensions);
  const [isExpanded, setIsExpanded] = useState(true);

  const parsedAdjustment = Number(adjustment);
  const safeAdjustment = isNaN(parsedAdjustment) ? 0 : parsedAdjustment;
  const unpaidExtensions = calculateUnpaidExtensions(extensions);
  const additionalPayment =
    debtAmount + unpaidExtensions + safeAdjustment - additionalPayments;
  const fullContractAmount = totalPrice + debtAmount + safeAdjustment;

  useEffect(() => {
    onFinanceUpdate?.({
      finalAmount: fullContractAmount,
      additionalPayment,
      adjustment: safeAdjustment,
      debtAmount,
    });
  }, [
    fullContractAmount,
    additionalPayment,
    safeAdjustment,
    debtAmount,
    onFinanceUpdate,
  ]);

  return (
    <div className={styles.infoBlock}>
      <button
        type="button"
        className={styles.blockTitle}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span className={styles.blockTitleLeft}>
          <CalendarClock size={20} />
          <h3>Продления</h3>
        </span>

        <span className={styles.blockTitleRight}>
          <span>{isExpanded ? "Скрыть продления" : "Показать продления"}</span>

          <ChevronDown
            size={16}
            className={`${styles.blockTitleArrow} ${
              isExpanded ? styles.blockTitleArrowOpen : ""
            }`}
          />
        </span>
      </button>
      <div
        className={`${styles.blockContent} ${
          isExpanded ? styles.blockContentOpen : ""
        }`}
      >
        <div className={styles.blockContentInner}>
          <OrderExtension
            order={order}
            onExtensionCreated={(extension) => {
              setExtensions((prev) => [...prev, extension]);
            }}
            onExtensionUpdated={(updatedExtension) => {
              setExtensions((prev) =>
                prev.map((extension) =>
                  extension.id === updatedExtension.id
                    ? updatedExtension
                    : extension,
                ),
              );
            }}
          />

          {extensions.length > 0 ? (
            <OrderExtensionsList
              extensions={extensions}
              items={order.order_items}
              orderId={order.id}
              orderNumber={order.order_number}
              onExtensionPaid={(extensionId, amount) => {
                setExtensions((prev) =>
                  prev.map((extension) =>
                    extension.id === extensionId
                      ? {
                          ...extension,
                          paid_amount: extension.paid_amount + amount,
                        }
                      : extension,
                  ),
                );
              }}
            />
          ) : (
            <div className={styles.emptyExtensions}>
              <span>Продлений нет</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
