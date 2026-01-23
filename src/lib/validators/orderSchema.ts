import { z } from "zod";

export const orderSchema = z
  .object({
    inventory_id: z.string().min(1, "Выберите инструмент"),
    start_date: z.string().min(1, "Укажите дату начала"),
    end_date: z.string().min(1, "Укажите дату окончания"),

    // Поля клиента (обязательные для договора)
    last_name: z.string().min(2, "Минимум 2 символа"),
    first_name: z.string().min(2, "Минимум 2 символа"),
    middle_name: z.string().min(2, "Минимум 2 символа"),
    phone: z
      .string()
      .transform((val) => val.replace(/\s/g, "")) // Убираем пробелы
      .refine(
        (val) => /^\+?[78]\d{10}$/.test(val),
        "Введите номер в формате +79991234567 или 89991234567",
      ),

    // Паспортные данные (опционально, но с валидацией длины, если введены)
    passport_series: z
      .string()
      .transform((val) => val.replace(/\s/g, "")) // Убираем пробелы
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
  })

  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;
      return new Date(data.end_date) >= new Date(data.start_date);
    },
    {
      message: "Дата возврата не может быть раньше начала",
      path: ["end_date"],
    },
  );

export type OrderInput = z.infer<typeof orderSchema>;
