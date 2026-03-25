"use client";

import { useEffect, useState, useMemo } from "react";
import Handlebars from "handlebars";
import styles from "./RentalContract.module.css";
import { ContractItem, ContractOrderData } from "@/types";
import { priceToWords } from "@/helpers";
import { supabase } from "@/lib/supabase/supabase";

Handlebars.registerHelper("eq", function (a, b) {
  return String(a) === String(b);
});

interface Props {
  items: ContractItem[];
  orderData: ContractOrderData;
  onReady?: () => void;
}

const RentalContract = ({ items, orderData, onReady }: Props) => {
  const [templateHtml, setTemplateHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const res = await fetch("/api/contract-template", {
          headers: session
            ? {
                Authorization: `Bearer ${session.access_token}`,
              }
            : {},
        });

        const data = await res.json();

        if (data.success) {
          setTemplateHtml(data.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
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
      const priceAtTime = Number(item.daily_price || item.price_at_time || 0);

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

    // Находим максимальную дату среди всех товаров
    const maxEndDate = items.reduce((max, item) => {
      const currentItemEnd = new Date(item.end_date).getTime();
      const maxTime = max ? new Date(max).getTime() : 0;
      return currentItemEnd > maxTime ? item.end_date : max;
    }, items[0]?.end_date || null);

    // Форматируем её для вывода
    const maxEndDateFormatted = maxEndDate
      ? new Date(maxEndDate).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "не указана";

    const totalRentalSum = processedItems.reduce(
      (sum, i) => sum + i.rowTotal,
      0,
    );
    const totalPurchasePrice = items.reduce(
      (sum, i) => sum + Number(i.purchase_price || 0),
      0,
    );
    const securityDepositValue = Number(orderData.security_deposit) || 0;

    const clientShortName =
      orderData.client_type === "individual"
        ? `${orderData.first_name?.[0] || ""}.${orderData.middle_name?.[0] || ""}. ${orderData.last_name || ""}`
        : orderData.company_name || "";

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
      maxEndDateFormatted,
      clientShortName,
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

  useEffect(() => {
    if (!loading && compiledHtml) {
      onReady?.();
    }
  }, [loading, compiledHtml, onReady]);

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
