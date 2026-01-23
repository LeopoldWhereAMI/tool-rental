import styles from "./Form.module.css";
import FormField from "../FormField/FormField";
import { useForm } from "react-hook-form";
import {
  InventoryCreateInput,
  inventoryCreateSchema,
} from "@/lib/validators/inventorySchema";
import { zodResolver } from "@hookform/resolvers/zod";

type InventoryFormProps = {
  defaultValues: InventoryCreateInput;
  onSubmit: (data: InventoryCreateInput) => void;
  submitText?: string;
};

export default function InventoryForm({
  defaultValues,
  onSubmit,
  submitText,
}: InventoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<InventoryCreateInput>({
    resolver: zodResolver(inventoryCreateSchema),
    defaultValues: defaultValues,
    mode: "onTouched",
  });

  const handleFormSubmit = async (data: InventoryCreateInput) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={styles.addInventoryForm}
    >
      <h1>Введите информацию об инструменте:</h1>

      <FormField label="Название" id="name" error={errors.name?.message}>
        <input
          id="name"
          className={`${styles.input} ${errors.name ? styles.error : ""}`}
          type="text"
          {...register("name")}
        />
      </FormField>

      <div className={styles.row}>
        <FormField label="Артикул" id="article" error={errors.article?.message}>
          <input
            id="article"
            className={`${styles.input} ${errors.article ? styles.error : ""}`}
            type="text"
            {...register("article")}
          />
        </FormField>

        <FormField
          label="Серийный номер"
          id="serial_number"
          error={errors.serial_number?.message}
        >
          <input
            id="serial_number"
            className={styles.input}
            type="text"
            {...register("serial_number")}
          />
        </FormField>
        <FormField
          label="Категория"
          id="category"
          error={errors.category?.message}
        >
          <select
            id="category"
            className={`${styles.input} ${errors.category ? styles.error : ""}`}
            {...register("category")}
          >
            <option value="">Выберите категорию</option>
            <option value="gas_tools">Бензоинструмент</option>
            <option value="electric_tools">Электроинструмент</option>
          </select>
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField
          label="Стоимость аренды"
          id="daily_price"
          error={errors.daily_price?.message}
        >
          <input
            id="daily_price"
            className={styles.input}
            type="text"
            min="0"
            step="0.01"
            {...register("daily_price")}
          />
        </FormField>

        <FormField
          label="Количество"
          id="quantity"
          error={errors.quantity?.message}
        >
          <input
            id="quantity"
            className={styles.input}
            type="number"
            min="0"
            {...register("quantity")}
          />
        </FormField>

        <FormField
          label="Закупочная цена"
          id="purchase_price"
          error={errors.purchase_price?.message}
        >
          <input
            id="purchase_price"
            className={styles.input}
            type="text"
            min="0"
            step="0.01"
            {...register("purchase_price")}
          />
        </FormField>
      </div>

      <FormField label="Дата покупки" id="purchase_date">
        <input
          id="purchase_date"
          className={styles.input}
          type="date"
          {...register("purchase_date")}
        />
      </FormField>

      <FormField label="Примечания" id="notes">
        <textarea
          id="notes"
          className={styles.textarea}
          rows={4}
          {...register("notes")}
        ></textarea>
      </FormField>
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={styles.saveInventoryBtn}
      >
        {isSubmitting ? "Сохранение..." : submitText || "Добавить инструмент"}
      </button>
    </form>
  );
}
