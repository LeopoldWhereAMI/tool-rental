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
import { Calendar, Trash2, Package, Search, Check } from "lucide-react";

import FormField from "@/components/Form/FormField/FormField";
import InputWithIcon from "@/components/Form/InputWithIcon/InputWithIcon";
import DaysBox from "../DaysBox/DaysBox";
import OrderInventorySelectModal from "../OrderInventorySelect/OrderInventorySelectModal";
import styles from "./OrderItemRow.module.css";

type OrderItemRowProps = {
  index: number;
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
  control,
  register,
  errors,
  clearErrors,
  setValue,
  inventory,
  onRemove,
  canRemove,
}: OrderItemRowProps) {
  const currentItem = useWatch({
    control,
    name: `items.${index}`,
  });

  const [manualEntry, setManualEntry] = useState(false);

  const hasInventory = Boolean(currentItem?.inventory_id);

  const hasCustomName = Boolean(currentItem?.custom_name?.trim());

  const hasCustomPrice =
    currentItem?.custom_price !== undefined &&
    currentItem?.custom_price !== null;

  const hasCustom = hasCustomName && hasCustomPrice;
  const isCustomView = !hasInventory && (manualEntry || hasCustom);

  const isFilled = hasInventory || hasCustom;

  const isCustomComplete =
    isCustomView &&
    hasCustomName &&
    hasCustomPrice &&
    Boolean(currentItem?.start_date) &&
    Boolean(currentItem?.end_date);

  const switchToManual = () => {
    setManualEntry(true);
  };

  const switchToSearch = () => {
    setValue(`items.${index}.custom_name`, undefined);
    setValue(`items.${index}.custom_price`, undefined);
    setValue(`items.${index}.custom_description`, undefined);

    setManualEntry(false);
  };

  // Ошибки конкретных полей
  const customNameError = Boolean(errors.items?.[index]?.custom_name);
  const customPriceError = Boolean(errors.items?.[index]?.custom_price);
  const inventoryError = Boolean(errors.items?.[index]?.inventory_id);
  const startDateError = Boolean(errors.items?.[index]?.start_date);
  const endDateError = Boolean(errors.items?.[index]?.end_date);

  return (
    <div
      className={`${styles.itemCard} ${isFilled ? styles.itemCardFilled : ""}`}
    >
      {/* Верхняя строка */}
      <div className={styles.itemHeader}>
        <div className={styles.itemTitle}>
          <span className={styles.itemNumber}>
            <Package size={12} />
            {index + 1}
          </span>

          <span className={styles.itemType}>
            {isCustomView ? "Ручная позиция" : "Инструмент"}
          </span>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className={styles.itemRemoveBtn}
            aria-label="Удалить позицию"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Поля */}
      <div
        className={`${styles.fieldsRow} ${
          isCustomView ? styles.fieldsRowCustom : ""
        }`}
        key={isCustomView ? "custom" : "inventory"}
      >
        {/* Название / инструмент */}
        <div className={styles.field}>
          {isCustomView ? (
            <FormField id={`items.${index}.custom_name`} label="Название">
              <div className={styles.customNameWrapper}>
                <input
                  {...register(`items.${index}.custom_name` as const)}
                  className={`${styles.customInput} ${
                    isCustomComplete ? styles.customNameComplete : ""
                  } ${customNameError ? styles.inputError : ""}`}
                  placeholder="Например: Цепь пильная"
                />

                {isCustomComplete && (
                  <span className={styles.completeCheck}>
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                )}
              </div>
            </FormField>
          ) : (
            <FormField id={`items.${index}.inventory_id`} label="Инструмент">
              <div className={inventoryError ? styles.selectError : undefined}>
                <OrderInventorySelectModal
                  index={index}
                  control={control}
                  register={register}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  inventory={inventory}
                />
              </div>
            </FormField>
          )}
        </div>

        {/* Цена — только для ручной позиции */}
        {isCustomView && (
          <div className={styles.field}>
            <FormField id={`items.${index}.custom_price`} label="Цена/сут">
              <div className={styles.priceInputWrapper}>
                <input
                  {...register(`items.${index}.custom_price` as const, {
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                  type="number"
                  min="0"
                  className={`${styles.customInput} ${
                    isCustomComplete ? styles.customInputFilled : ""
                  } ${customPriceError ? styles.inputError : ""}`}
                  placeholder="0"
                />

                <span>₽</span>
              </div>
            </FormField>
          </div>
        )}

        {/* Начало */}
        <div className={styles.field}>
          <FormField id={`items.${index}.start_date`} label="Начало">
            <InputWithIcon
              type="date"
              id={`items.${index}.start_date`}
              icon={Calendar}
              className={`${isCustomComplete ? styles.customInputFilled : ""} ${
                startDateError ? styles.inputError : ""
              }`}
              register={register(`items.${index}.start_date` as const)}
            />
          </FormField>
        </div>

        {/* Возврат */}
        <div className={styles.field}>
          <FormField id={`items.${index}.end_date`} label="Возврат">
            <InputWithIcon
              type="date"
              id={`items.${index}.end_date`}
              icon={Calendar}
              disabled={!isCustomView && !hasInventory}
              className={`${!isCustomView && !hasInventory ? styles.disabledInput : ""} ${
                isCustomComplete ? styles.customInputFilled : ""
              } ${endDateError ? styles.inputError : ""}`}
              register={register(`items.${index}.end_date` as const)}
            />
          </FormField>
        </div>

        {/* Дни */}
        <div className={styles.daysField}>
          <FormField id={`items.${index}.days`}>
            <DaysBox index={index} control={control} setValue={setValue} />
          </FormField>
        </div>
      </div>

      {/* Нижняя ссылка */}
      <div className={styles.rowFooter}>
        {isCustomView ? (
          <button
            type="button"
            className={styles.linkBtn}
            onClick={switchToSearch}
          >
            <Search size={11} />
            Искать на складе
          </button>
        ) : (
          !hasInventory && (
            <button
              type="button"
              className={styles.linkBtn}
              onClick={switchToManual}
            >
              <span className={styles.plus}>+</span>
              Добавить вручную
            </button>
          )
        )}
      </div>
    </div>
  );
}
