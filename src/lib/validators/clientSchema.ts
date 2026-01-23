import { z } from "zod";

export const clientSchema = z.object({
  last_name: z.string().min(2, "Минимум 2 символа"),
  first_name: z.string().min(2, "Минимум 2 символа"),
  middle_name: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+?[78]\d{10}$/, "Неверный формат телефона (+7...)"),
  // Валидация паспорта (опционально, так как в базу пока не пишем)
  passport_series: z.string().length(4, "4 цифры").optional().or(z.literal("")),
  passport_number: z.string().length(6, "6 цифр").optional().or(z.literal("")),

  issued_by: z.string().optional(),
  issue_date: z.string().optional(),
  registration_address: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
