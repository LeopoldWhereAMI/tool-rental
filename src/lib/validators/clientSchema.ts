// import { z } from "zod";

// export const clientSchema = z.object({
//   last_name: z.string().min(2, "Минимум 2 символа"),
//   first_name: z.string().min(2, "Минимум 2 символа"),
//   middle_name: z.string().optional(),
//   phone: z
//     .string()
//     .regex(/^\+?[78]\d{10}$/, "Неверный формат телефона (+7...)"),
//   // Валидация паспорта (опционально, так как в базу пока не пишем)
//   passport_series: z.string().length(4, "4 цифры").optional().or(z.literal("")),
//   passport_number: z.string().length(6, "6 цифр").optional().or(z.literal("")),

//   issued_by: z.string().optional(),
//   issue_date: z.string().optional(),
//   registration_address: z.string().optional(),
// });

// export type ClientFormData = z.infer<typeof clientSchema>;

// src/lib/validators/clientSchema.ts
import { z } from "zod";

export const individualClientSchema = z.object({
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
        .regex(/^\d+$/, "Только цифры")
        .length(4, "Ровно 4 цифры"),
    ),
  passport_number: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z
        .string()
        .min(1, "Введите номер")
        .regex(/^\d+$/, "Только цифры")
        .length(6, "Ровно 6 цифр"),
    ),
  issued_by: z.string().min(1, "Укажите, кем выдан"),
  issue_date: z.string().min(1, "Укажите дату выдачи"),
  registration_address: z.string().min(1, "Укажите адрес регистрации"),
});

export const legalClientSchema = z.object({
  client_type: z.literal("legal"),
  company_name: z.string().min(2, "Укажите название компании"),
  inn: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z.string().length(10, "Ровно 10 цифр").regex(/^\d+$/, "Только цифры"),
    ),
  kpp: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(z.string().length(9, "Ровно 9 цифр").regex(/^\d+$/, "Только цифры"))
    .optional(),
  ogrn: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(z.string().max(15, "Не более 15 цифр").regex(/^\d+$/, "Только цифры"))
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

export const clientSchema = z.discriminatedUnion("client_type", [
  individualClientSchema,
  legalClientSchema,
]);

export type ClientFormInput = z.infer<typeof clientSchema>;
