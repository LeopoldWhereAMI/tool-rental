import { validateCategory, validateDate, validateStatus } from "@/helpers";
import { InventoryUI } from "@/types";
import styles from "./ItemDetailsList.module.css";

type ItemDetailsListProps = {
  item: InventoryUI;
};

export default function ItemDetailsList({ item }: ItemDetailsListProps) {
  const details = [
    { label: "Название", value: item.name },
    { label: "Артикул", value: item.article },
    {
      label: "Категория",
      value: item.category && validateCategory(item.category),
    },
    { label: "Дата приёма на склад", value: validateDate(item.created_at) },
    { label: "Стоимость аренды", value: `${item.daily_price}р` },
    { label: "ID", value: item.id },
    { label: "Примечания", value: item.notes },
    { label: "Дата покупки", value: validateDate(item.purchase_date) },
    { label: "Закупочная цена", value: `${item.purchase_price}р` },
    { label: "Количество на складе", value: item.quantity },
    { label: "Серийный номер", value: item.serial_number },
    {
      label: "Статус доступности",
      value: item.status && validateStatus(item.status),
    },
    { label: "Дата обновления", value: validateDate(item.updated_at) },
  ];

  return (
    <ul className={styles.itemInfoList}>
      {details.map((detail, index) => (
        <li key={index}>
          {detail.label} <strong>{detail.value}</strong>
        </li>
      ))}
    </ul>
  );
}
