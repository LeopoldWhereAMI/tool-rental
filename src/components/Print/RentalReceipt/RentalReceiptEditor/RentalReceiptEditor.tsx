"use client";

import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import styles from "./RentalReceiptEditor.module.css";
import RentalReceiptPrint from "../RentalReceiptPrint/RentalReceiptPrint";
import { PrinterIcon } from "lucide-react";

export default function RentalReceiptEditor() {
  const [organizationName, setOrganizationName] = useState("Мастерская №1");
  const [instrumentName, setInstrumentName] = useState("");
  const [rentalDays, setRentalDays] = useState(1);
  const [pricePerDay, setPricePerDay] = useState(0);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Rental Receipt",
  });

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Универсальный чек аренды</h2>

      <div className={styles.form}>
        <label htmlFor="organizationName">Название организации</label>
        <input
          value={organizationName}
          name="organizationName"
          onChange={(e) => setOrganizationName(e.target.value)}
          placeholder="Название организации"
        />

        <label htmlFor="instrumentName">Название инструмента</label>
        <input
          value={instrumentName}
          name="instrumentName"
          onChange={(e) => setInstrumentName(e.target.value)}
          placeholder="Название инструмента"
        />
        <label htmlFor="rentalDays">Количество дней</label>
        <input
          type="number"
          value={rentalDays}
          name="rentalDays"
          onChange={(e) => setRentalDays(Number(e.target.value))}
          placeholder="Количество дней"
        />
        <label htmlFor="pricePerDay">Цена за сутки</label>
        <input
          type="number"
          value={pricePerDay}
          name="pricePerDay"
          onChange={(e) => setPricePerDay(Number(e.target.value))}
          placeholder="Цена за сутки"
        />
      </div>

      <button onClick={handlePrint} className={styles.printBtn}>
        <PrinterIcon size={16} />
        Печать
      </button>

      <div className={styles.printWrapper}>
        <div ref={printRef}>
          <RentalReceiptPrint
            organizationName={organizationName}
            instrumentName={instrumentName}
            rentalDays={rentalDays}
            pricePerDay={pricePerDay}
            date={new Date().toLocaleDateString()}
          />
        </div>
      </div>
    </div>
  );
}
