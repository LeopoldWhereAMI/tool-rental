"use client";

import { useEffect, useState, useMemo } from "react";
import Handlebars from "handlebars";
import styles from "./RentalContract.module.css";
import { ContractItem, ContractOrderData } from "@/types";
import { priceToWords } from "@/helpers";

interface Props {
  items: ContractItem[];
  orderData: ContractOrderData;
}

const RentalContract = ({ items, orderData }: Props) => {
  const [templateHtml, setTemplateHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contract-template")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTemplateHtml(data.data);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const context = useMemo(() => {
    const now = new Date();
    const adjValue = Number(orderData.adjustment) || 0;
    const totalPrice = Number(orderData.total_price) || 0;
    const basePrice = totalPrice - adjValue;

    const processedItems = items.map((item, index) => {
      const s = new Date(item.start_date);
      const e = new Date(item.end_date);
      const diff = e.getTime() - s.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
      const priceAtTime = Number(item.price_at_time || item.daily_price || 0);

      return {
        ...item,
        index: index + 1,
        days,
        price: priceAtTime,
        rowTotal: priceAtTime * days,
        articleOrSerial: item.article || item.serial_number || "—",
        formattedEndDate: e.toLocaleDateString("ru-RU"),
      };
    });

    const totalRentalSum = processedItems.reduce(
      (sum, i) => sum + i.rowTotal,
      0,
    );
    const totalPurchasePrice = items.reduce(
      (sum, i) => sum + Number(i.purchase_price || 0),
      0,
    );
    const securityDepositValue = Number(orderData.security_deposit) || 0;

    return {
      ...orderData,
      items: processedItems,
      totalRentalSum,
      finalTotal: totalPrice,
      totalPurchasePrice,
      totalPurchasePriceWords: priceToWords(totalPurchasePrice),
      security_deposit: securityDepositValue,
      securityDepositWords: priceToWords(
        Number(orderData.security_deposit || 0),
      ),

      hasAdjustment: adjValue !== 0,
      isExtraCharge: adjValue > 0,
      adjValue: Math.abs(adjValue),
      basePrice: basePrice,

      formattedDate: now.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      hours: now.getHours().toString().padStart(2, "0"),
      minutes: now.getMinutes().toString().padStart(2, "0"),
    };
  }, [items, orderData]);

  const compiledHtml = useMemo(() => {
    if (!templateHtml) return "";
    try {
      const template = Handlebars.compile(templateHtml);
      return template(context);
    } catch (error) {
      console.error("Handlebars compilation error:", error);
      return `<p style="color: red;">Ошибка в синтаксисе шаблона: ${(error as Error).message}</p>`;
    }
  }, [templateHtml, context]);

  if (loading) return <div className={styles.loading}>Загрузка шаблона...</div>;

  return (
    <div className={styles.printWrapper}>
      <article
        className={styles.container}
        dangerouslySetInnerHTML={{ __html: compiledHtml }}
      />
    </div>
  );
};

RentalContract.displayName = "RentalContract";
export default RentalContract;
