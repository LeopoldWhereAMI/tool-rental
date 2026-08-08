import { z } from "zod";
import { clientSchema, individualClientSchema } from "./clientSchema";

// Схема для items — теперь гибридная
const orderItemSchema = z
  .object({
    inventory_id: z.string().optional(),
    custom_name: z.string().min(1, "Укажите название").optional(),
    custom_price: z.coerce
      .number()
      .min(0, "Цена не может быть отрицательной")
      .optional(),
    custom_description: z.string().optional(),
    start_date: z.string().min(1, "Укажите дату начала"),
    end_date: z.string().min(1, "Укажите дату окончания"),
  })
  .refine(
    (item) => {
      const hasInventory = !!item.inventory_id;
      const hasCustom = !!item.custom_name && item.custom_price !== undefined;
      return hasInventory || hasCustom;
    },
    {
      message:
        "Выберите инструмент из списка или заполните название и цену вручную",
      path: ["inventory_id"],
    },
  )
  .refine(
    (item) => {
      if (!item.start_date || !item.end_date) return true;
      return new Date(item.end_date) >= new Date(item.start_date);
    },
    {
      message: "Дата возврата не может быть раньше начала",
      path: ["end_date"],
    },
  );

const orderItemsSchema = z
  .array(orderItemSchema)
  .min(1, "Добавьте хотя бы одну позицию")
  .refine(
    (items) => {
      const ids = items.map((i) => i.inventory_id).filter(Boolean);
      return new Set(ids).size === ids.length;
    },
    {
      message: "Один и тот же инструмент не может быть добавлен дважды",
      path: [],
    },
  );

// ✅ РЕШЕНИЕ 1: Использовать .and() вместо .merge()
export const orderSchema = clientSchema.and(
  z.object({
    items: orderItemsSchema,
    security_deposit: z.coerce.number().min(0).optional(),
  }),
);

// Извлекаем паспортные данные для физического лица
export const passportValidationSchema = individualClientSchema.pick({
  passport_series: true,
  passport_number: true,
  issued_by: true,
  issue_date: true,
  registration_address: true,
});

export type PassportInput = z.infer<typeof passportValidationSchema>;

export type OrderInput = z.infer<typeof orderSchema>;
