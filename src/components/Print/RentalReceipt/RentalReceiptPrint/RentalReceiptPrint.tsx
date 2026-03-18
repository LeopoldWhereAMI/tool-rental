"use client";

import styles from "./RentalReceiptPrint.module.css";

type Props = {
  organizationName: string;
  instrumentName: string;
  rentalDays: number;
  pricePerDay: number;
  date: string;
};

export default function RentalReceiptPrint({
  organizationName,
  instrumentName,
  rentalDays,
  pricePerDay,
  date,
}: Props) {
  const total = rentalDays * pricePerDay;

  return (
    <div className={styles.act}>
      <h1 className={styles.title}>Акт аренды</h1>

      <p>
        Организация: <strong>{organizationName}</strong>
      </p>

      <p>Дата: {date}</p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Дни</th>
            <th>Цена за сутки</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{instrumentName}</td>
            <td>{rentalDays}</td>
            <td>{pricePerDay} ₽</td>
            <td>{total} ₽</td>
          </tr>
        </tbody>
      </table>

      <div className={styles.signatures}>
        <div>Подпись __________________________</div>
        <div>Печать __________________________</div>
      </div>
    </div>
  );
}
