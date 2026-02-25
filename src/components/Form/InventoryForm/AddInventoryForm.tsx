"use client";

import styles from "./InventoryForm.module.css";
import FormField from "../FormField/FormField";
import { useForm } from "react-hook-form";
import {
  InventoryCreateInput,
  inventoryCreateSchema,
} from "@/lib/validators/inventorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RussianRuble,
  Tag,
  Package,
  Calendar,
  Hash,
  Info,
  Banknote,
  FileText,
} from "lucide-react";
import useInventoryForm from "@/hooks/useInventoryForm";
import InputWithIcon from "../InputWithIcon/InputWithIcon";
import { InventoryFormValues, InventoryItemBase } from "./inventoryFormTypes";

type InventoryFormProps = {
  defaultValues: InventoryFormValues;
  onSubmit: (data: InventoryCreateInput) => void;
  existingItems?: InventoryItemBase[];
};

export default function AddInventoryForm({
  defaultValues,
  onSubmit,
  existingItems = [],
}: InventoryFormProps) {
  const methods = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryCreateSchema),
    defaultValues,
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useInventoryForm(methods, existingItems, defaultValues.id);

  return (
    <form
      id="add-inventory-form"
      onSubmit={handleSubmit(onSubmit)}
      className={`${styles.form} ${styles.twoColumnLayout}`}
    >
      <div className={styles.mainLayout}>
        {/* Секция 1: Вся информация */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <Info size={20} />
            <h3>Основная информация</h3>
          </div>

          <div className={styles.fieldsFlex}>
            <FormField
              label="Название инструмента"
              id="name"
              error={errors.name?.message}
            >
              <InputWithIcon
                icon={Package}
                placeholder="Напр: Перфоратор Makita HR2470"
                register={register("name")}
                error={!!errors.name}
              />
            </FormField>

            <FormField
              label="Категория"
              id="category"
              error={errors.category?.message}
            >
              <select
                id="category"
                className={`${styles.select} ${errors.category ? styles.errorInput : ""}`}
                {...register("category")}
              >
                <option value="">Выберите категорию</option>
                <option value="gas_tools">Бензоинструмент</option>
                <option value="electric_tools">Электроинструмент</option>
              </select>
            </FormField>

            <FormField
              label="Артикул (будет сгенерирован)"
              id="article"
              error={errors.article?.message}
            >
              <InputWithIcon
                icon={Hash}
                register={register("article")}
                error={!!errors.article}
                placeholder="Сначала выберите категорию"
              />
            </FormField>

            <FormField
              label="Серийный номер"
              id="serial_number"
              error={errors.serial_number?.message}
            >
              <InputWithIcon
                icon={Hash}
                register={register("serial_number")}
                error={!!errors.serial_number}
                placeholder="S/N"
              />
            </FormField>
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionTitle}>
            <Banknote size={20} />
            <h3>Данные об учете</h3>
          </div>

          <div className={styles.fieldsFlex}>
            <FormField
              label="Аренда (сут)"
              id="daily_price"
              error={errors.daily_price?.message}
            >
              <InputWithIcon
                icon={RussianRuble}
                type="number"
                step="0.01"
                register={register("daily_price")}
                error={!!errors.daily_price}
              />
            </FormField>

            <FormField
              label="Цена закупки"
              id="purchase_price"
              error={errors.purchase_price?.message}
            >
              <InputWithIcon
                icon={RussianRuble}
                type="number"
                step="0.01"
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
        </section>

        {/* Секция 2: Примечания */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <FileText size={20} />
            <h3>Примечания</h3>
          </div>
          <FormField id="notes">
            <InputWithIcon
              isTextArea
              rows={10}
              register={register("notes")}
              placeholder="Добавьте важную информацию об инструменте..."
            />
          </FormField>
        </section>
      </div>
    </form>
  );
}
