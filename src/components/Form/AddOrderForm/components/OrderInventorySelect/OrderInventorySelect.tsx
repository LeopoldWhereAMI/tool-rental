"use client";

import { useWatch } from "react-hook-form";
import { OrderInput } from "@/lib/validators/orderSchema";
import { Inventory } from "@/types";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors,
  Control,
} from "react-hook-form";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";

type Props = {
  index: number;
  control: Control<OrderInput>;
  register: UseFormRegister<OrderInput>;
  setValue: UseFormSetValue<OrderInput>;
  clearErrors: UseFormClearErrors<OrderInput>;
  inventory: Inventory[];
};

export default function OrderInventorySelect({
  index,
  control,
  register,
  setValue,
  clearErrors,
  inventory,
}: Props) {
  const watchedItems = useWatch({ control, name: "items" });

  const selectedInventoryIds =
    watchedItems?.map((i) => i.inventory_id).filter(Boolean) || [];

  return (
    <select
      {...register(`items.${index}.inventory_id` as const, {
        onChange: (e) => {
          const value = e.target.value;

          clearErrors(`items.${index}.inventory_id`);

          if (!value) return;

          const startDate = watchedItems?.[index]?.start_date;
          if (!startDate) return;

          const start = new Date(startDate);
          const end = new Date(start);
          end.setDate(start.getDate() + 1);

          const formattedEnd = end.toISOString().split("T")[0];

          setValue(`items.${index}.end_date`, formattedEnd, {
            shouldValidate: true,
            shouldDirty: true,
          });
        },
      })}
      className={styles.select}
    >
      <option value="">Выбрать</option>

      {inventory.map((item) => {
        const isAlreadySelected = selectedInventoryIds.includes(item.id);
        const isSelectedHere = watchedItems?.[index]?.inventory_id === item.id;

        if (isAlreadySelected && !isSelectedHere) return null;

        return (
          <option key={item.id} value={item.id}>
            ( {item.article}) {"_"} {item.name} ({item.daily_price}₽)
          </option>
        );
      })}
    </select>
  );
}
