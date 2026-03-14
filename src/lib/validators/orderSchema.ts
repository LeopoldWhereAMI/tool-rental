import { z } from "zod";

// Схема для физического лица
const individualClientSchema = z.object({
  client_type: z.literal("individual"),
  last_name: z.string().min(2, "Минимум 2 символа"),
  first_name: z.string().min(2, "Минимум 2 символа"),
  middle_name: z.string().min(2, "Минимум 2 символа").optional(),
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
});

// Схема для юридического лица
const legalClientSchema = z.object({
  client_type: z.literal("legal"),
  company_name: z.string().min(2, "Укажите название компании"),
  inn: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z
        .string()
        .length(10, "ИНН должен содержать ровно 10 цифр")
        .regex(/^\d+$/, "ИНН должен содержать только цифры"),
    ),
  kpp: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z
        .string()
        .length(9, "КПП должен содержать ровно 9 цифр")
        .regex(/^\d+$/, "КПП должен содержать только цифры"),
    )
    .optional(),
  ogrn: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z
        .string()
        .max(15, "ОГРН должен содержать не более 15 цифр")
        .regex(/^\d+$/, "ОГРН должен содержать только цифры"),
    )
    .optional(),
  legal_address: z.string().min(1, "Укажите юридический адрес"),
  phone: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .refine(
      (val) => /^\+?[78]\d{10}$/.test(val),
      "Введите номер в формате +79991234567 или 89991234567",
    )
    .optional(),
});

// Объединенная схема с дискриминацией по client_type
const clientSchema = z.discriminatedUnion("client_type", [
  individualClientSchema,
  legalClientSchema,
]);

// Схема для items (заказываемые инструменты)
const orderItemsSchema = z
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
