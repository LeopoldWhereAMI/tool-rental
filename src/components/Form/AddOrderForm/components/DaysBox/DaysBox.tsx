"use client";

import { useWatch } from "react-hook-form";
import { OrderInput } from "@/lib/validators/orderSchema";
import { Control, UseFormSetValue } from "react-hook-form";
import styles from "./DaysBox.module.css";

type Props = {
  index: number;
  control: Control<OrderInput>;
  setValue: UseFormSetValue<OrderInput>;
};

export default function DaysBox({ index, control, setValue }: Props) {
  const watchedItems = useWatch({ control, name: "items" });

  const startDate = watchedItems?.[index]?.start_date ?? "";
  const endDate = watchedItems?.[index]?.end_date ?? "";

  const calcDays = (start: string, end: string) => {
    if (!start || !end) return null;

    const diff = Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    return diff > 0 ? diff : null;
  };

  const days = calcDays(startDate, endDate);

  return (
    <div className={styles.daysBox}>
      <span className={styles.label}>дней</span>

      <input
        type="number"
        min={1}
        step={1}
        value={days ?? ""}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (!value || value < 1) return;
          if (!startDate) return;

          const start = new Date(startDate);
          const newEnd = new Date(start);
          newEnd.setDate(start.getDate() + value);

          const formattedEnd = newEnd.toISOString().split("T")[0];

          setValue(`items.${index}.end_date`, formattedEnd, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
        className={styles.input}
      />
    </div>
  );
}
