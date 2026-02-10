"use client";

import styles from "./Form.module.css";
import FormField from "../FormField/FormField";
import { useForm } from "react-hook-form";
import {
  InventoryCreateInput,
  inventoryCreateSchema,
} from "@/lib/validators/inventorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RussianRuble, Tag, Package, Calendar } from "lucide-react";

import useInventoryForm from "@/hooks/useInventoryForm";
import InputWithIcon from "./InputWithIcon";
import { InventoryFormValues, InventoryItemBase } from "./inventoryFormTypes";
import Loader from "@/components/ui/Loader/Loader";

type InventoryFormProps = {
  defaultValues: InventoryFormValues;
  onSubmit: (data: InventoryCreateInput) => void;
  submitText?: string;
  existingItems?: InventoryItemBase[];
};

export default function InventoryForm({
  defaultValues,
  onSubmit,
  submitText,
  existingItems = [],
}: InventoryFormProps) {
  const methods = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryCreateSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  // Определяем, редактируем мы или создаем
  const isEditMode = !!defaultValues.id;
  useInventoryForm(methods, existingItems, isEditMode, defaultValues.id);

  const handleFormSubmit = async (data: InventoryCreateInput) => {
    await onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={styles.addInventoryForm}
    >
      <h1>Введите информацию об инструменте</h1>

      <FormField label="Название" id="name" error={errors.name?.message}>
        <InputWithIcon
          icon={Package}
          placeholder="Напр: Перфоратор Makita HR2470"
          register={register("name")}
          error={!!errors.name}
        />
      </FormField>

      <div className={styles.row}>
        <FormField
          label="Категория"
          id="category"
          error={errors.category?.message}
        >
          <select
            id="category"
            className={`${styles.input} ${styles.select} ${errors.category ? styles.error : ""}`}
            {...register("category")}
          >
            <option value="">Выберите категорию</option>
            <option value="gas_tools">Бензоинструмент</option>
            <option value="electric_tools">Электроинструмент</option>
          </select>
        </FormField>

        <FormField
          label="Серийный номер"
          id="serial_number"
          error={errors.serial_number?.message}
        >
          <InputWithIcon
            register={register("serial_number")}
            error={!!errors.serial_number}
            inputMode="numeric"
          />
        </FormField>

        <FormField label="Артикул" id="article" error={errors.article?.message}>
          <InputWithIcon
            icon={Tag}
            register={register("article")}
            error={!!errors.article}
            readOnly={isEditMode}
            placeholder="Будет сгенерирован..."
            className={styles.articleInput}
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField
          label="Стоимость аренды (сут)"
          id="daily_price"
          error={errors.daily_price?.message}
        >
          <InputWithIcon
            icon={RussianRuble}
            type="number"
            step="0.01"
            placeholder="0.00"
            register={register("daily_price")}
            error={!!errors.daily_price}
          />
        </FormField>

        <FormField
          label="Закупочная цена"
          id="purchase_price"
          error={errors.purchase_price?.message}
        >
          <InputWithIcon
            icon={RussianRuble}
            type="number"
            step="0.01"
            placeholder="0.00"
            register={register("purchase_price")}
            error={!!errors.purchase_price}
          />
        </FormField>

        <FormField label="Дата покупки" id="purchase_date">
          <InputWithIcon
            icon={Calendar}
            type="date"
            register={register("purchase_date")}
          />
        </FormField>
      </div>

      <FormField label="Примечания" id="notes">
        <InputWithIcon isTextArea rows={4} register={register("notes")} />
      </FormField>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={styles.saveInventoryBtn}
      >
        {isSubmitting ? (
          <>
            <Loader size={18} label="" />
            <span>Сохранение...</span>
          </>
        ) : (
          submitText || "Добавить инструмент"
        )}
      </button>
    </form>
  );
}
