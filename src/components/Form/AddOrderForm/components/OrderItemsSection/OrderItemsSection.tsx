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
import { Plus } from "lucide-react";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import OrderItemRow from "./OrderItemRow";

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
      {fields.map((field, index) => (
        <OrderItemRow
          key={field.id}
          index={index}
          fieldId={field.id}
          control={control}
          register={register}
          errors={errors}
          clearErrors={clearErrors}
          setValue={setValue}
          inventory={inventory}
          onRemove={() => remove(index)}
          canRemove={fields.length > 1}
        />
      ))}

      <button
        type="button"
        disabled={
          isAllToolsSelected && watchedItems?.every((i) => i.inventory_id)
        }
        onClick={() =>
          append({
            inventory_id: "",
            start_date: new Date().toISOString().split("T")[0],
            end_date: "",
          })
        }
        className={styles.addToolBtn}
      >
        <Plus size={18} /> Добавить позицию
      </button>
    </>
  );
}
