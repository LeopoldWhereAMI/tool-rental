"use client";

import { Fuel, LayoutGrid, Plug } from "lucide-react";
import styles from "./CategoryChips.module.css";

type CategoryChipsProps = {
  value: string;
  onChange: (value: string) => void;
};

const CATEGORIES = [
  { value: "all", label: "Все", icon: LayoutGrid },
  { value: "gas_tools", label: "Бензо", icon: Fuel },
  { value: "electric_tools", label: "Электро", icon: Plug },
];

export default function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <div className={styles.chips}>
      {CATEGORIES.map((category) => {
        const isActive = value === category.value;
        const IconComponent = category.icon;

        // Формируем класс для иконки: общая база + специфичный цвет
        const iconClassName = `${styles.chipIcon} ${
          category.value === "gas_tools"
            ? styles.gasIcon
            : category.value === "electric_tools"
              ? styles.electricIcon
              : styles.defaultIcon
        }`;

        return (
          <button
            key={category.value}
            type="button"
            title={category.label}
            className={`${isActive ? styles.chipActive : styles.chip} ${styles[category.value]}`}
            onClick={() => onChange(category.value)}
          >
            {IconComponent && (
              <IconComponent size={16} className={iconClassName} />
            )}
          </button>
        );
      })}
    </div>
  );
}
