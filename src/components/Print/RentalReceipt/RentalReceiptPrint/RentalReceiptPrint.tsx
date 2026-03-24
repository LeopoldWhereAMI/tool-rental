"use client";

import styles from "./RentalReceiptPrint.module.css";

type Item = {
  name: string;
  quantity: number;
  price: number;
};

type Props = {
  organizationName: string;
  items: Item[];
  date: string;
};

export default function RentalReceiptPrint({
  organizationName,
  items,
  date,
}: Props) {
  const grandTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  return (
    <div className={styles.act}>
      <h1 className={styles.title}>Товарный чек</h1>
      <div className={styles.actHeader}>
        <p>
          Организация: <span>{organizationName}</span>
        </p>
        <p>ИП: Голубев Максим Анатольевич</p>
        <p>ИНН: 463310485078</p>
        <p>Адрес: г. Железногорск, ул. Мира 6А</p>
        <p>Телефон: +7 930 852-22-96</p>
        <p>Дата: {date}</p>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Кол-во</th>
            <th>Цена</th>
            <th>Сумма</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => {
            const total = item.quantity * item.price;

            return (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price} ₽</td>
                <td>{total} ₽</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className={styles.total}>
        Итого: <strong>{grandTotal} ₽</strong>
      </p>
      <div className={styles.signatures}>
        <div>Подпись __________________________</div>
      </div>
    </div>
  );
}
