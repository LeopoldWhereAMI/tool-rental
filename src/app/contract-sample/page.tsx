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

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import styles from "./ContractSample.module.css";

export default function ContractEditorPage() {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Загрузка текущего шаблона
  useEffect(() => {
    fetch("/api/contract-template")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHtmlContent(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  // Сохранение шаблона
  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/contract-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html_content: htmlContent }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Шаблон успешно сохранен!");
      } else {
        setMessage("❌ Ошибка: " + data.error);
      }
    } catch (error) {
      setMessage("❌ Ошибка сети");
    } finally {
      setIsSaving(false);
    }
  };

  // Откат к предыдущей версии
  const handleRestore = async () => {
    if (!confirm("Вы уверены, что хотите откатиться к предыдущей версии?"))
      return;

    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/contract-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Шаблон восстановлен! Обновляю страницу...");
        window.location.reload(); // Простой способ подтянуть восстановленный шаблон
      } else {
        setMessage("❌ Ошибка: " + data.error);
      }
    } catch (error) {
      setMessage("❌ Ошибка сети");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Загрузка редактора...</div>;

  // return (
  //   <div className="flex flex-col h-screen p-4 max-w-6xl mx-auto gap-4">
  //     <div className="flex justify-between items-center">
  //       <h1 className="text-2xl font-bold">Редактор шаблона договора</h1>
  //       <div className="flex gap-4 items-center">
  //         <span className="text-sm font-medium">{message}</span>
  //         <button
  //           onClick={handleRestore}
  //           className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
  //           disabled={isSaving}
  //         >
  //           Откатить версию
  //         </button>
  //         <button
  //           onClick={handleSave}
  //           className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
  //           disabled={isSaving}
  //         >
  //           {isSaving ? "Сохранение..." : "Сохранить шаблон"}
  //         </button>
  //       </div>
  //     </div>

  //     <div className="flex-1 border border-gray-300 rounded overflow-hidden">
  //       <Editor
  //         height="100%"
  //         defaultLanguage="html"
  //         value={htmlContent}
  //         onChange={(value) => setHtmlContent(value || "")}
  //         options={{
  //           wordWrap: "on",
  //           minimap: { enabled: false },
  //           fontSize: 14,
  //         }}
  //       />
  //     </div>

  //     <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
  //       <strong>Доступные переменные:</strong> {`{{order_number}}`},{" "}
  //       {`{{last_name}}`}, {`{{first_name}}`}, {`{{total_price}}`},{" "}
  //       {`{{formattedDate}}`} и другие. Для вывода списка инструментов
  //       используйте конструкцию: <br />
  //       <code>
  //         {`{{#each items}}`} ... {`{{this.name}}`} ... {`{{/each}}`}
  //       </code>
  //     </div>
  //   </div>
  // );
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.title}>
          <h1>Редактор шаблона договора</h1>
          <p>Настройте внешний вид вашего документа</p>
        </div>

        <div className={styles.actions}>
          {message && (
            <span
              className={`${styles.message} ${message.includes("✅") ? styles.messageSuccess : styles.messageError}`}
            >
              {message}
            </span>
          )}

          <button
            onClick={handleRestore}
            className={`${styles.btn} ${styles.btnRestore}`}
            disabled={isSaving}
          >
            Откатить версию
          </button>

          <button
            onClick={handleSave}
            className={`${styles.btn} ${styles.btnSave}`}
            disabled={isSaving}
          >
            {isSaving ? "Сохранение..." : "Сохранить шаблон"}
          </button>
        </div>
      </header>

      <div className={styles.editorWrapper}>
        <Editor
          height="100%"
          defaultLanguage="html"
          value={htmlContent}
          onChange={(value) => setHtmlContent(value || "")}
          options={{
            wordWrap: "on",
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
          }}
        />
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerSection}>
          <h3>Доступные переменные</h3>
          <div className={styles.variableList}>
            {["order_number", "last_name", "first_name", "total_price"].map(
              (v) => (
                <span key={v} className={styles.variableTag}>{`{{${v}}}`}</span>
              ),
            )}
          </div>
        </div>
        <div className={styles.footerSection}>
          <h3>Инструкция по циклам</h3>
          <p className={styles.codeExample}>
            Используйте <code>{`{{#each items}}`}</code> для списков. <br />
            Пример: <code>{`{{this.name}}`}</code> внутри блока.
          </p>
        </div>
      </footer>
    </div>
  );
}
