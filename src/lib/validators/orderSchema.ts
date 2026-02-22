import { z } from "zod";

export const orderSchema = z.object({
  items: z
    .array(
      z
        .object({
          inventory_id: z.string().min(1, "Выберите инструмент"),
          start_date: z.string().min(1, "Укажите дату начала"),
          end_date: z.string().min(1, "Укажите дату окончания"),
        })
        .refine(
          (item) => {
            if (!item.start_date || !item.end_date) return true;
            return new Date(item.end_date) >= new Date(item.start_date);
          },
          {
            message: "Дата возврата не может быть раньше начала",
            path: ["end_date"],
          },
        ),
    )
    .min(1, "Добавьте хотя бы один инструмент")
    .refine(
      (items) => {
        const ids = items.map((i) => i.inventory_id).filter(Boolean);
        return new Set(ids).size === ids.length;
      },
      {
        message: "Один и тот же инструмент не может быть добавлен дважды",
        path: [],
      },
    ),

  last_name: z.string().min(2, "Минимум 2 символа"),
  first_name: z.string().min(2, "Минимум 2 символа"),
  middle_name: z.string().min(2, "Минимум 2 символа"),
  phone: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .refine(
      (val) => /^\+?[78]\d{10}$/.test(val),
      "Введите номер в формате +79991234567 или 89991234567",
    ),

  passport_series: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z
        .string()
        .min(1, "Введите серию")
        .regex(/^\d+$/, "Серия должна содержать только цифры")
        .length(4, "Должно быть ровно 4 цифры"),
    ),

  passport_number: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z
        .string()
        .min(1, "Введите номер")
        .regex(/^\d+$/, "Номер должен содержать только цифры")
        .length(6, "Должно быть ровно 6 цифр"),
    ),

  issued_by: z.string().min(1, "Укажите, кем выдан"),
  issue_date: z.string().min(1, "Укажите дату выдачи"),
  registration_address: z.string().min(1, "Укажите адрес регистрации"),
  //
  security_deposit: z.coerce.number().min(0).optional(),
});

// Извлекаем только паспортные данные
export const passportValidationSchema = orderSchema.pick({
  passport_series: true,
  passport_number: true,
  issued_by: true,
  issue_date: true,
  registration_address: true,
});

export type PassportInput = z.infer<typeof passportValidationSchema>;

export type OrderInput = z.infer<typeof orderSchema>;
