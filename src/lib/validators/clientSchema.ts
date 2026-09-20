import { z } from "zod";

const phoneSchema = z
  .string()
  .transform((val) => val.replace(/[\s\-()]/g, ""))
  .superRefine((val, ctx) => {
    if (!/^\+?\d+$/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Только цифры, допустим ведущий +",
      });
      return;
    }
    const digits = val.replace("+", "");
    if (!/^[78]/.test(digits)) {
      ctx.addIssue({
        code: "custom",
        message: "Номер должен начинаться с +7, 7 или 8",
      });
    } else if (digits.length > 11) {
      ctx.addIssue({
        code: "custom",
        message: "Слишком много цифр, должно быть 11",
      });
    } else if (digits.length < 11) {
      ctx.addIssue({
        code: "custom",
        message: "Слишком мало цифр, должно быть 11",
      });
    }
  });

export const individualClientSchema = z.object({
  client_type: z.literal("individual"),
  last_name: z.string().min(2, "Минимум 2 символа"),
  first_name: z.string().min(2, "Минимум 2 символа"),
  middle_name: z.string().min(2, "Минимум 2 символа").optional(),

  phone: phoneSchema,
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

  phone: z.union([z.literal(""), phoneSchema]).optional(),
});

export const clientSchema = z.discriminatedUnion("client_type", [
  individualClientSchema,
  legalClientSchema,
]);

export type ClientFormInput = z.infer<typeof clientSchema>;
