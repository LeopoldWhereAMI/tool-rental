"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getPassport } from "@/services/passportService";
import { mapOrderDetailsToPrint } from "@/lib/mappers/orderMapper";
import { OrderDetailsUI, OrderPrintBundle } from "@/types";

export function useOrderPrint(
  order: OrderDetailsUI | null,
  finalAmount: number,
  adjustment: number,
) {
  const [printData, setPrintData] = useState<OrderPrintBundle | null>(null);
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintInitiation = async () => {
    if (!order) return;

    try {
      let passport = {
        passport_series: "",
        passport_number: "",
        issued_by: "",
        issue_date: "",
        registration_address: "",
      };

      if (order.client.client_type === "individual") {
        const clientPassport = await getPassport(order.client.id);

        if (clientPassport) {
          passport = clientPassport;
        }
      }

      const data = mapOrderDetailsToPrint(
        order,
        passport,
        finalAmount,
        adjustment,
      );

      setIsPreparingPrint(true);
      setPrintData(data);
    } catch (error) {
      console.error("Ошибка загрузки паспорта:", error);
      setIsPreparingPrint(false);
    }
  };

  const handleCancelPrint = () => {
    setIsPreparingPrint(false);
    setPrintData(null);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Договор_№${order?.order_number || "заказ"}`,
    onAfterPrint: () => {
      setPrintData(null);
      setIsPreparingPrint(false);
    },
  });

  return {
    printData,
    isPreparingPrint,
    printRef,
    handlePrintInitiation,
    handleCancelPrint,
    handlePrint,
  };
}
