"use client";

import { useState } from "react";
import { OrderInput } from "@/lib/validators/orderSchema";
import { Inventory } from "@/types";
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Calendar, Trash2, Package, PenLine } from "lucide-react";
import FormField from "@/components/Form/FormField/FormField";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import InputWithIcon from "@/components/Form/InputWithIcon/InputWithIcon";
import OrderInventorySelect from "../OrderInventorySelect/OrderInventorySelect";
import DaysBox from "../DaysBox/DaysBox";

type OrderItemRowProps = {
  index: number;
  fieldId: string;
  control: Control<OrderInput>;
  register: UseFormRegister<OrderInput>;
  errors: FieldErrors<OrderInput>;
  clearErrors: UseFormClearErrors<OrderInput>;
  setValue: UseFormSetValue<OrderInput>;
  inventory: Inventory[];
  onRemove: () => void;
  canRemove: boolean;
};

export default function OrderItemRow({
  index,
  fieldId,
  control,
  register,
  errors,
  clearErrors,
  setValue,
  inventory,
  onRemove,
  canRemove,
}: OrderItemRowProps) {
  const currentItem = useWatch({ control, name: `items.${index}` });

  // Определяем начальный режим по наличию inventory_id
  const initialMode: "inventory" | "custom" = currentItem?.inventory_id
    ? "custom"
    : "inventory";
  const [mode, setMode] = useState<"inventory" | "custom">(initialMode);

  const handleModeChange = (newMode: "inventory" | "custom") => {
    setMode(newMode);
    if (newMode === "inventory") {
      // Очищаем кастомные поля
      setValue(`items.${index}.custom_name`, undefined);
      setValue(`items.${index}.custom_price`, undefined);
      setValue(`items.${index}.custom_description`, undefined);
    } else {
      // Очищаем inventory_id
      setValue(`items.${index}.inventory_id`, "");
      clearErrors(`items.${index}.inventory_id`);
    }
  };

  return (
    <div key={fieldId} className={styles.itemRow}>
      {/* Переключатель режима — ВНЕ grid */}
      <div className={styles.modeToggle}>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "inventory" ? styles.modeBtnActive : ""}`}
          onClick={() => handleModeChange("inventory")}
        >
          <Package size={14} />
          Из склада
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === "custom" ? styles.modeBtnActive : ""}`}
          onClick={() => handleModeChange("custom")}
        >
          <PenLine size={14} />
          Вручную
        </button>
      </div>

      {/* Grid с условным классом для режима */}
      <div
        className={`${styles.itemGrid} ${mode === "custom" ? styles.itemGridCustom : ""}`}
      >
        {mode === "inventory" ? (
          <FormField
            id={`items.${index}.inventory_id`}
            label="Инструмент"
            error={errors.items?.[index]?.inventory_id?.message}
          >
            <OrderInventorySelect
              index={index}
              control={control}
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
              inventory={inventory}
            />
          </FormField>
        ) : (
          <>
            <FormField
              id={`items.${index}.custom_name`}
              label="Название"
              error={errors.items?.[index]?.custom_name?.message}
            >
              <input
                {...register(`items.${index}.custom_name` as const)}
                className={styles.customInput}
                placeholder="Например: Цепь пильная"
              />
            </FormField>

            <FormField
              id={`items.${index}.custom_price`}
              label="Цена/сут"
              error={errors.items?.[index]?.custom_price?.message}
            >
              <div className={styles.priceInputWrapper}>
                <input
                  {...register(`items.${index}.custom_price` as const, {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  type="number"
                  min="0"
                  className={styles.customInput}
                  placeholder="0"
                />
                <span>₽</span>
              </div>
            </FormField>
          </>
        )}

        <FormField
          id={`items.${index}.start_date`}
          label="Начало"
          error={errors.items?.[index]?.start_date?.message}
        >
          <InputWithIcon
            type="date"
            id={`items.${index}.start_date`}
            icon={Calendar}
            register={register(`items.${index}.start_date` as const)}
          />
        </FormField>

        <FormField
          id={`items.${index}.end_date`}
          label="Возврат"
          error={errors.items?.[index]?.end_date?.message}
        >
          <InputWithIcon
            type="date"
            id={`items.${index}.end_date`}
            icon={Calendar}
            disabled={mode === "inventory" && !currentItem?.inventory_id}
            className={
              mode === "inventory" && !currentItem?.inventory_id
                ? styles.disabledInput
                : ""
            }
            register={register(`items.${index}.end_date` as const)}
          />
        </FormField>

        <DaysBox index={index} control={control} setValue={setValue} />

        {canRemove && (
          <button type="button" onClick={onRemove} className={styles.removeBtn}>
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
