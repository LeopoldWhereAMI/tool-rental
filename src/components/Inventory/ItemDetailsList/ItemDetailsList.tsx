import { validateCategory, validateDate } from "@/helpers";
import { InventoryUI } from "@/types";
import styles from "./ItemDetailsList.module.css";

type ItemDetailsListProps = {
  item: InventoryUI;
};

export default function ItemDetailsList({ item }: ItemDetailsListProps) {
  const details = [
    {
      label: "Категория",
      value: item.category ? validateCategory(item.category) : "—",
    },
    {
      label: "Дата покупки",
      value: validateDate(item.purchase_date),
    },
    {
      label: "Закупочная цена",
      value: item.purchase_price ? `${item.purchase_price} ₽` : "—",
    },
    {
      label: "Арендная ставка",
      value: `${item.daily_price} ₽ / сут.`,
    },
    {
      label: "Принят на склад",
      value: validateDate(item.created_at),
    },
    {
      label: "Последнее ТО",
      value: item.last_maintenance_date
        ? validateDate(item.last_maintenance_date)
        : "Не проводилось",
    },
    {
      label: "Последнее обновление",
      value: validateDate(item.updated_at),
    },
    // {
    //   label: "Системный ID",
    //   value: item.id,
    // },
  ];

  return (
    <div className={styles.wrapper}>
      <ul className={styles.itemInfoList}>
        {details.map((detail, index) => (
          <li key={index} className={styles.itemInfoRow}>
            <span className={styles.label}>{detail.label}</span>
            <span className={styles.value}>{detail.value}</span>
          </li>
        ))}
      </ul>

      {item.notes && (
        <div className={styles.specNotes}>
          <p className={styles.noteTitle}>Примечания</p>
          <p className={styles.noteText}>{item.notes}</p>
        </div>
      )}
    </div>
  );
}
