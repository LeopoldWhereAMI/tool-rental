// "use client";

// import RentalContract from "@/components/Print/RentalContract/RentalContract";
// import styles from "./ContractSample.module.css";
// import { ContractItem, ContractOrderData } from "@/types";
// import { useState } from "react";

// export default function ContractSamplePage() {
//   const [isEditable, setIsEditable] = useState(false);

//   const sampleOrderData: ContractOrderData = {
//     order_number: 0,
//     last_name: "____________________",
//     first_name: "____________________",
//     middle_name: "____________________",
//     phone: "+7 (___) ___-__-__",
//     passport_series: "____",
//     passport_number: "______",
//     issued_by: "________________________________________",
//     issue_date: "____________________",
//     registration_address: "________________________________________________",
//     total_price: 0,
//     adjustment: 0,
//     security_deposit: 0,
//   };

//   const sampleItems: ContractItem[] = [
//     {
//       id: "sample-1",
//       name: "________________________________",
//       purchase_price: 0,
//       article: "________",
//       serial_number: "________",
//       daily_price: 0,
//       price_at_time: 0,
//       start_date: new Date().toISOString(),
//       end_date: new Date().toISOString(),
//     },
//   ];

//   return (
//     <div className={styles.pageBackground}>
//       <nav className={styles.noPrintNav}>
//         <div className={styles.navContent}>
//           <h1>
//             {isEditable ? "📝 Редактирование образца" : "📄 Просмотр образца"}
//           </h1>
//           <div className={styles.navActions}>
//             <button
//               onClick={() => setIsEditable(!isEditable)}
//               className={isEditable ? styles.saveButton : styles.editButton}
//             >
//               {isEditable ? "Зафиксировать текст" : "Редактировать текст"}
//             </button>
//             <button
//               onClick={() => window.print()}
//               className={styles.printButton}
//             >
//               Распечатать
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div
//         className={`${styles.contractScale} ${isEditable ? styles.editableActive : ""}`}
//         contentEditable={isEditable}
//         suppressContentEditableWarning={true}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" && !e.shiftKey) {
//           }
//         }}
//       >
//         <RentalContract items={sampleItems} orderData={sampleOrderData} />
//       </div>
//     </div>
//   );
// }

"use client";

import RentalContract from "@/components/Print/RentalContract/RentalContract";
import ContractTemplateEditor from "@/components/ContractTemplateEditor/ContractTemplateEditor";
import styles from "./ContractSample.module.css";
import { ContractItem, ContractOrderData } from "@/types";
import { useState, useEffect } from "react";

export default function ContractSamplePage() {
  const [isEditable, setIsEditable] = useState(false);
  const [customHtml, setCustomHtml] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем сохраненный шаблон из БД при открытии страницы
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const response = await fetch("/api/contract-template");
        const data = await response.json();
        if (data.success) {
          setCustomHtml(data.data);
        }
      } catch (err) {
        console.error("Ошибка при загрузке шаблона:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, []);

  // Перезагружаем шаблон после сохранения
  const handleTemplateUpdated = async () => {
    try {
      const response = await fetch("/api/contract-template");
      const data = await response.json();
      if (data.success) {
        setCustomHtml(data.data);
      }
    } catch (err) {
      console.error("Ошибка при обновлении шаблона:", err);
    }
  };

  const sampleOrderData: ContractOrderData = {
    order_number: 0,
    last_name: "____________________",
    first_name: "____________________",
    middle_name: "____________________",
    phone: "+7 (___) ___-__-__",
    passport_series: "____",
    passport_number: "______",
    issued_by: "________________________________________",
    issue_date: "____________________",
    registration_address: "________________________________________________",
    total_price: 0,
    adjustment: 0,
    security_deposit: 0,
  };

  const sampleItems: ContractItem[] = [
    {
      id: "sample-1",
      name: "________________________________",
      purchase_price: 0,
      article: "________",
      serial_number: "________",
      daily_price: 0,
      price_at_time: 0,
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
    },
  ];

  if (isLoading) {
    return <div>Загрузка договора...</div>;
  }

  return (
    <div className={styles.pageBackground}>
      <nav className={styles.noPrintNav}>
        <div className={styles.navContent}>
          <h1>
            {isEditable ? "📝 Редактирование образца" : "📄 Просмотр образца"}
          </h1>
          <div className={styles.navActions}>
            {/* ← ДОБАВЛЯЕМ РЕДАКТОР */}
            <ContractTemplateEditor onSave={handleTemplateUpdated} />

            <button
              onClick={() => setIsEditable(!isEditable)}
              className={isEditable ? styles.saveButton : styles.editButton}
            >
              {isEditable ? "Зафиксировать текст" : "Редактировать текст"}
            </button>
            <button
              onClick={() => window.print()}
              className={styles.printButton}
            >
              Распечатать
            </button>
          </div>
        </div>
      </nav>

      {/* Передаём сохраненный HTML в компонент */}
      <div
        className={`${styles.contractScale} ${isEditable ? styles.editableActive : ""}`}
        contentEditable={isEditable}
        suppressContentEditableWarning={true}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
          }
        }}
      >
        <RentalContract
          items={sampleItems}
          orderData={sampleOrderData}
          customHtml={customHtml}
        />
      </div>
    </div>
  );
}
