"use client";

import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./RentalReceiptEditor.module.css";
import RentalReceiptPrint from "../RentalReceiptPrint/RentalReceiptPrint";
import { PrinterIcon, PlusCircle, Trash2 } from "lucide-react";

type Item = {
  name: string;
  quantity: number;
  price: number;
};

export default function RentalReceiptEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [organizationName, setOrganizationName] = useState("Мастерская №1");
  const [items, setItems] = useState<Item[]>([
    { name: "", quantity: 1, price: 0 },
  ]);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  const deleteItem = (index: number) => {
    if (items.length === 1) {
      setItems([{ name: "", quantity: 1, price: 0 }]);
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof Item,
    value: string | number,
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Акт аренды - ${organizationName}`,
  });

  const calculateTotal = (item: Item) => item.quantity * item.price;
  const grandTotal = items.reduce((sum, item) => sum + calculateTotal(item), 0);
  const hasItems = items.some(
    (item) => item.name.trim() !== "" && item.price > 0,
  );

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Создание товарного чека</h2>

      <div className={styles.wrapper}>
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="orgName">Название организации / ИП</label>
            <input
              id="orgName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Например: ИП Иванов А.А."
            />
          </div>

          <div style={{ marginTop: "24px" }}>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th className={styles.colName}>Наименование услуги</th>
                  <th className={styles.colQty}>Кол-во</th>
                  <th className={styles.colPrice}>Цена (₽)</th>
                  <th className={styles.colTotal}>Сумма</th>
                  <th className={styles.colAction}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td data-label="Наименование">
                      <input
                        className={styles.tableInput}
                        value={item.name}
                        onChange={(e) =>
                          updateItem(index, "name", e.target.value)
                        }
                        placeholder="Описание услуги"
                      />
                    </td>
                    <td className={styles.colQty} data-label="Количество">
                      <input
                        type="number"
                        className={`${styles.tableInput} `}
                        value={item.quantity}
                        min="1"
                        onChange={(e) =>
                          updateItem(index, "quantity", Number(e.target.value))
                        }
                      />
                    </td>
                    <td className={styles.colPrice} data-label="Цена">
                      <input
                        type="number"
                        className={`${styles.tableInput} `}
                        value={item.price}
                        min="0"
                        onChange={(e) =>
                          updateItem(index, "price", Number(e.target.value))
                        }
                      />
                    </td>
                    <td className={styles.colTotal} data-label="Сумма">
                      {calculateTotal(item).toLocaleString()} ₽
                    </td>
                    <td className={styles.colAction} data-label="">
                      <button
                        type="button"
                        onClick={() => deleteItem(index)}
                        className={styles.btnIcon}
                        title="Удалить строку"
                        disabled={items.length === 1 && item.name === ""}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={addItem} className={styles.btnAddRow}>
              <PlusCircle size={16} />
              Добавить услугу
            </button>
          </div>

          <div
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <button
              onClick={handlePrint}
              className={styles.printBtn}
              disabled={!hasItems}
              title={
                !hasItems
                  ? "Добавьте хотя бы одну услугу с названием и ценой"
                  : "Распечатать акт"
              }
            >
              <PrinterIcon size={18} />
              Распечатать акт ({grandTotal.toLocaleString()} ₽)
            </button>
          </div>
        </div>

        {!isMobile && (
          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            className={styles.previewToggle}
          >
            {showPreview ? "Скрыть предпросмотр" : "Показать предпросмотр"}
          </button>
        )}

        {/* Предпросмотр чека — всегда виден */}
        {showPreview && !isMobile && (
          <div className={styles.previewSection}>
            <h3 className={styles.previewTitle}>Предпросмотр товарного чека</h3>

            <div className={styles.previewContainer}>
              <div ref={printRef}>
                <RentalReceiptPrint
                  organizationName={organizationName}
                  items={items}
                  date={new Date().toLocaleDateString("ru-RU")}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
