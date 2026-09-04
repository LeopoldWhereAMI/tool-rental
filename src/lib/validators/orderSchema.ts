import { z } from "zod";
import { clientSchema, individualClientSchema } from "./clientSchema";

const orderItemSchema = z
  .object({
    inventory_id: z.string().optional(),

    custom_name: z.string().optional(),

    custom_price: z.coerce
      .number()
      .min(0, "Цена не может быть отрицательной")
      .optional(),

    custom_description: z.string().optional(),

    start_date: z.string().min(1, "Укажите дату начала"),

    end_date: z.string().min(1, "Укажите дату окончания"),
  })
  .superRefine((item, ctx) => {
    const hasInventory = Boolean(item.inventory_id);
    const hasCustomName = Boolean(item.custom_name?.trim());
    const hasCustomPrice =
      item.custom_price !== undefined && item.custom_price !== null;

    // Должен быть либо инструмент, либо полностью заполненная ручная позиция
    if (!hasInventory && !hasCustomName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Укажите название",
        path: ["custom_name"],
      });
    }

    if (!hasInventory && !hasCustomPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Укажите цену",
        path: ["custom_price"],
      });
    }

    // Если выбрана ручная позиция — inventory_id не нужен
    // Если выбран складской инструмент — custom-поля не нужны.

    if (
      item.start_date &&
      item.end_date &&
      new Date(item.end_date) < new Date(item.start_date)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Дата возврата не может быть раньше начала",
        path: ["end_date"],
      });
    }
  });

const orderItemsSchema = z
  .array(orderItemSchema)
  .min(1, "Добавьте хотя бы одну позицию")
  .superRefine((items, ctx) => {
    const inventoryIds = new Map<string, number>();

    items.forEach((item, index) => {
      if (!item.inventory_id) return;

      const previousIndex = inventoryIds.get(item.inventory_id);

      if (previousIndex !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Один и тот же инструмент не может быть добавлен дважды",
          path: [index, "inventory_id"],
        });
      } else {
        inventoryIds.set(item.inventory_id, index);
      }
    });
  });

export const orderSchema = clientSchema.and(
  z.object({
    items: orderItemsSchema,

    security_deposit: z.coerce
      .number()
      .min(0, "Залог не может быть отрицательным")
      .optional(),
    price_adjustment: z.coerce.number().optional(),
  }),
);

export const passportValidationSchema = individualClientSchema.pick({
  passport_series: true,
  passport_number: true,
  issued_by: true,
  issue_date: true,
  registration_address: true,
});

export type PassportInput = z.infer<typeof passportValidationSchema>;

export type OrderInput = z.infer<typeof orderSchema>;
