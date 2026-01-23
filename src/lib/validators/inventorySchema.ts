import { z } from "zod";

export const InventoryStatus = z.enum([
  "available",
  "rented",
  "maintenance",
  "reserved",
]);

// Схема для данных, отправляемых при создании/редактировании
export const inventoryCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Название должно быть не менее 2 символов")
    .max(100, "Название не должно превышать 100 символов"),

  article: z
    .string()
    .min(1, "Артикул обязателен")
    .max(50, "Артикул не должен превышать 50 символов"),

  serial_number: z
    .string()
    .max(100, "Слишком длинный серийный номер")
    .nullable()
    .optional(),

  category: z.string().min(1, "Выберите категорию"),

  daily_price: z.coerce
    .number()
    .min(0, "Цена не может быть отрицательной")
    .max(1000000, "Слишком высокая цена"),

  quantity: z.coerce
    .number()
    .int("Должно быть целое число")
    .min(0, "Количество не может быть отрицательным")
    .max(1000, "Слишком большое количество"),

  purchase_price: z.coerce
    .number()
    .min(0, "Цена не может быть отрицательной")
    .optional()
    .nullable(),

  purchase_date: z.string().optional().nullable(),

  notes: z
    .string()
    .max(1000, "Примечание не должно превышать 1000 символов")
    .optional()
    .nullable(),
});

// Схема для полной записи из Supabase
export const inventoryRecordSchema = inventoryCreateSchema.extend({
  id: z.string(),
  created_at: z.string(), // ISO string
  updated_at: z.string(),
  status: InventoryStatus,
});

export type InventoryCreateInput = z.infer<typeof inventoryCreateSchema>;
export type InventoryRecord = z.infer<typeof inventoryRecordSchema>;
