// "use client";

// import { useEffect, useState, useMemo } from "react";
// import Handlebars from "handlebars";
// import styles from "./RentalContract.module.css";
// import { ContractItem, ContractOrderData } from "@/types";
// import { priceToWords } from "@/helpers";
// import { supabase } from "@/lib/supabase/supabase";

// interface Props {
//   items: ContractItem[];
//   orderData: ContractOrderData;
// }

// const RentalContract = ({ items, orderData }: Props) => {
//   const [templateHtml, setTemplateHtml] = useState<string>("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadTemplate = async () => {
//       try {
//         const {
//           data: { session },
//         } = await supabase.auth.getSession();

//         const res = await fetch("/api/contract-template", {
//           headers: session
//             ? {
//                 Authorization: `Bearer ${session.access_token}`,
//               }
//             : {},
//         });

//         const data = await res.json();

//         if (data.success) {
//           setTemplateHtml(data.data);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadTemplate();
//   }, []);

//   const context = useMemo(() => {
//     const now = new Date();
//     const adjValue = Number(orderData.adjustment) || 0;
//     const totalPrice = Number(orderData.total_price) || 0;
//     const basePrice = totalPrice - adjValue;

//     const processedItems = items.map((item, index) => {
//       const s = new Date(item.start_date);
//       const e = new Date(item.end_date);
//       const diff = e.getTime() - s.getTime();
//       const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
//       const priceAtTime = Number(item.price_at_time || item.daily_price || 0);

//       return {
//         ...item,
//         index: index + 1,
//         days,
//         price: priceAtTime,
//         rowTotal: priceAtTime * days,
//         articleOrSerial: item.article || item.serial_number || "—",
//         formattedEndDate: e.toLocaleDateString("ru-RU"),
//       };
//     });

//     const totalRentalSum = processedItems.reduce(
//       (sum, i) => sum + i.rowTotal,
//       0,
//     );
//     const totalPurchasePrice = items.reduce(
//       (sum, i) => sum + Number(i.purchase_price || 0),
//       0,
//     );
//     const securityDepositValue = Number(orderData.security_deposit) || 0;

//     return {
//       ...orderData,
//       items: processedItems,
//       totalRentalSum,
//       finalTotal: totalPrice,
//       totalPurchasePrice,
//       totalPurchasePriceWords: priceToWords(totalPurchasePrice),
//       security_deposit: securityDepositValue,
//       securityDepositWords: priceToWords(
//         Number(orderData.security_deposit || 0),
//       ),

//       hasAdjustment: adjValue !== 0,
//       isExtraCharge: adjValue > 0,
//       adjValue: Math.abs(adjValue),
//       basePrice: basePrice,

//       formattedDate: now.toLocaleDateString("ru-RU", {
//         day: "2-digit",
//         month: "long",
//         year: "numeric",
//       }),
//       hours: now.getHours().toString().padStart(2, "0"),
//       minutes: now.getMinutes().toString().padStart(2, "0"),
//     };
//   }, [items, orderData]);

//   const compiledHtml = useMemo(() => {
//     if (!templateHtml) return "";
//     try {
//       const template = Handlebars.compile(templateHtml);
//       return template(context);
//     } catch (error) {
//       console.error("Handlebars compilation error:", error);
//       return `<p style="color: red;">Ошибка в синтаксисе шаблона: ${(error as Error).message}</p>`;
//     }
//   }, [templateHtml, context]);

//   if (loading) return <div className={styles.loading}>Загрузка шаблона...</div>;

//   return (
//     <div className={styles.printWrapper}>
//       <article
//         className={styles.container}
//         dangerouslySetInnerHTML={{ __html: compiledHtml }}
//       />
//     </div>
//   );
// };

// RentalContract.displayName = "RentalContract";
// export default RentalContract;
"use client";

import { useEffect, useState, useMemo } from "react";
import Handlebars from "handlebars";
import styles from "./RentalContract.module.css";
import { ContractItem, ContractOrderData } from "@/types";
import { priceToWords } from "@/helpers";
import { supabase } from "@/lib/supabase/supabase";

interface Props {
  items: ContractItem[];
  orderData: ContractOrderData;
}

const RentalContract = ({ items, orderData }: Props) => {
  const [templateHtml, setTemplateHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🟢 RentalContract: useEffect START");

    const loadTemplate = async () => {
      console.log("🟡 loadTemplate: начал выполнение");

      try {
        // 1. Проверяем клиент Supabase
        console.log("1. Проверяем supabase клиент:", !!supabase);

        // 2. Получаем сессию
        console.log("2. Получаем сессию...");
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log("3. Результат получения сессии:", {
          hasSession: !!session,
          hasError: !!sessionError,
          errorMessage: sessionError?.message,
          userId: session?.user?.id,
        });

        // 3. Формируем headers
        const headers: HeadersInit = {};
        if (session) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
          console.log("4. Токен добавлен в headers:", !!session.access_token);
        } else {
          console.log("4. Токен НЕ добавлен (нет сессии)");
        }

        // 4. Делаем запрос
        console.log("5. Делаем fetch запрос к /api/contract-template");
        const res = await fetch("/api/contract-template", { headers });

        console.log("6. Ответ получен:", {
          status: res.status,
          statusText: res.statusText,
          ok: res.ok,
          headers: Object.fromEntries(res.headers.entries()),
        });

        // 5. Парсим JSON
        let data;
        try {
          data = await res.json();
          console.log("7. JSON распарсен:", data);
        } catch (jsonError) {
          console.error("8. Ошибка парсинга JSON:", jsonError);
          return;
        }

        // 6. Проверяем success
        if (data.success) {
          console.log(
            "9. success=true, устанавливаем templateHtml, длина:",
            data.data?.length,
          );
          setTemplateHtml(data.data);
        } else {
          console.error("9. success=false, ошибка API:", data);
        }
      } catch (err) {
        console.error("🔴 Критическая ошибка в loadTemplate:", err);
      } finally {
        console.log("10. finally: устанавливаем loading=false");
        setLoading(false);
      }
    };

    loadTemplate();
  }, []);

  const context = useMemo(() => {
    console.log("🟢 useMemo context: пересчет", {
      itemsCount: items.length,
      orderData,
    });

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
    console.log("🟢 useMemo compiledHtml:", {
      hasTemplate: !!templateHtml,
      templateLength: templateHtml?.length,
    });

    if (!templateHtml) {
      console.log("templateHtml пустой, возвращаем пустую строку");
      return "";
    }

    try {
      console.log("Компилируем Handlebars шаблон...");
      const template = Handlebars.compile(templateHtml);
      const result = template(context);
      console.log(
        "Handlebars компиляция успешна, длина результата:",
        result.length,
      );
      return result;
    } catch (error) {
      console.error("🔴 Handlebars compilation error:", error);
      return `<p style="color: red;">Ошибка в синтаксисе шаблона: ${(error as Error).message}</p>`;
    }
  }, [templateHtml, context]);

  console.log("🟢 RentalContract render:", {
    loading,
    hasTemplate: !!templateHtml,
    hasCompiledHtml: !!compiledHtml,
    itemsCount: items.length,
  });

  if (loading) {
    console.log("Рендерим loading state");
    return <div className={styles.loading}>Загрузка шаблона...</div>;
  }

  console.log("Рендерим финальный HTML, длина:", compiledHtml.length);
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
