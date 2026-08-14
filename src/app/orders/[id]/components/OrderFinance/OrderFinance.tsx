"use client";

import { OrderDetailsUI } from "@/types";
import { useOrderStatusInfo } from "@/hooks/useOrderStatusInfo";
import { useEffect, useState } from "react";
import OrderExtension from "../OrderExtension/OrderExtension";
import OrderExtensionsList from "../OrderExtension/OrderExtensionsList";
import { calculateUnpaidExtensions } from "./helper";
import styles from "./OrderFinance.module.css";
import { CalendarClock } from "lucide-react";

type OrderFinanceProps = {
  totalPrice: number;
  order: OrderDetailsUI;
  adjustment: number | string;

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
  onFinanceUpdate,
}: OrderFinanceProps) {
  const { debtAmount } = useOrderStatusInfo(order);
  const [extensions, setExtensions] = useState(order.extensions);
  const parsedAdjustment = Number(adjustment);
  const safeAdjustment = isNaN(parsedAdjustment) ? 0 : parsedAdjustment;
  const unpaidExtensions = calculateUnpaidExtensions(extensions);
  const additionalPayment = debtAmount + unpaidExtensions + safeAdjustment;
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
      <div className={styles.blockTitle}>
        <CalendarClock size={20} /> <h3>Продления</h3>
      </div>
      <div className={styles.blockContent}>
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
  );
}
