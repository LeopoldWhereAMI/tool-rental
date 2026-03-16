"use client";

import { OrderInput } from "@/lib/validators/orderSchema";
import { Inventory } from "@/types";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Calendar, Plus, Trash2 } from "lucide-react";
import FormField from "@/components/Form/FormField/FormField";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import InputWithIcon from "@/components/Form/InputWithIcon/InputWithIcon";
import OrderInventorySelect from "../OrderInventorySelect/OrderInventorySelect";
import DaysBox from "../DaysBox/DaysBox";

type OrderItemsSectionProps = {
  control: Control<OrderInput>;
  register: UseFormRegister<OrderInput>;
  errors: FieldErrors<OrderInput>;
  clearErrors: UseFormClearErrors<OrderInput>;
  setValue: UseFormSetValue<OrderInput>;
  inventory: Inventory[];
};

export default function OrderItemsSection({
  control,
  register,
  errors,
  clearErrors,
  setValue,
  inventory,
}: OrderItemsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" });
  const selectedInventoryIds =
    watchedItems?.map((i) => i.inventory_id).filter(Boolean) || [];
  const isAllToolsSelected =
    selectedInventoryIds.length >= inventory.length && inventory.length > 0;

  return (
    <>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className={styles.itemRow}>
            <div className={styles.itemGrid}>
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
                  disabled={!watchedItems?.[index]?.inventory_id}
                  className={
                    !watchedItems?.[index]?.inventory_id
                      ? styles.disabledInput
                      : ""
                  }
                  title={
                    !watchedItems?.[index]?.inventory_id
                      ? "Сначала выберите инструмент"
                      : ""
                  }
                  register={register(`items.${index}.end_date` as const)}
                />
              </FormField>

              <DaysBox index={index} control={control} setValue={setValue} />

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className={styles.removeBtn}
                  style={{ marginTop: "32px" }}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      <button
        type="button"
        disabled={isAllToolsSelected}
        onClick={() =>
          append({
            inventory_id: "",
            start_date: new Date().toISOString().split("T")[0],
            end_date: "",
          })
        }
        className={styles.addToolBtn}
      >
        <Plus size={18} /> Добавить инструмент
      </button>
    </>
  );
}
