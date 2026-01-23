"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./AddClientForm.module.css";
import { createClientInSupabase } from "@/services/clientsService";
import {
  clientSchema,
  type ClientFormData,
} from "@/lib/validators/clientSchema";
import FormField from "../FormField/FormField";
import { toast } from "sonner";

export default function AddClientForm({
  onSuccess,
  onClose,
}: {
  onSuccess: (id: string) => void;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      const {
        passport_series,
        passport_number,
        issued_by,
        issue_date,
        registration_address,
        ...dbData
      } = data;

      // 2. Отправляем в базу "чистый" объект
      const newClient = await createClientInSupabase(dbData);

      if (newClient) {
        // 3. Сообщаем родителю ID нового клиента
        toast.success("Клиент успешно создан!");
        onSuccess(newClient.id);
        // 4. Закрываем модальное окно
        onClose();
      }
    } catch (err) {
      // Выводим ошибку для отладки
      console.error("Ошибка сохранения клиента:", err);
      toast.error("Не удалось сохранить клиента. Проверьте данные.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.clientForm}>
        {/* <h3>ФИО</h3>
        <div className={styles.nameInfo}>
          <FormField
            label="Фамилия *"
            id="last_name"
            error={errors.last_name?.message}
            className={styles.flexItem}
          >
            <input
              {...register("last_name")}
              id="last_name"
              type="text"
              className={styles.input}
            />
          </FormField>

          <FormField
            label="Имя *"
            id="first_name"
            error={errors.first_name?.message}
            className={styles.flexItem}
          >
            <input
              {...register("first_name")}
              id="first_name"
              type="text"
              className={styles.input}
            />
          </FormField>

          <FormField
            label="Отчество"
            id="middle_name"
            error={errors.middle_name?.message}
            className={styles.flexItem}
          >
            <input
              {...register("middle_name")}
              id="middle_name"
              type="text"
              className={styles.input}
            />
          </FormField>
        </div>

        <FormField label="Телефон *" id="phone" error={errors.phone?.message}>
          <input
            {...register("phone")}
            id="phone"
            type="text"
            placeholder="+7..."
            className={styles.input}
          />
        </FormField> */}

        {/* <h3>Паспортные данные</h3>
        <div className={styles.pasportInfo}>
          <FormField
            label="Серия"
            id="passport_series"
            error={errors.passport_series?.message}
            className={styles.flexItem}
          >
            <input
              {...register("passport_series")}
              id="passport_series"
              type="text"
              maxLength={4}
              className={styles.input}
            />
          </FormField>

          <FormField
            label="Номер"
            id="passport_number"
            error={errors.passport_number?.message}
            className={styles.flexItem}
          >
            <input
              {...register("passport_number")}
              id="passport_number"
              type="text"
              maxLength={6}
              className={styles.input}
            />
          </FormField>

          <FormField
            label="Дата выдачи"
            id="issue_date"
            error={errors.issue_date?.message}
            className={styles.flexItem}
          >
            <input
              {...register("issue_date")}
              id="issue_date"
              type="date"
              className={styles.input}
            />
          </FormField>
        </div>

        <FormField
          label="Кем выдан"
          id="issued_by"
          error={errors.issued_by?.message}
        >
          <input
            {...register("issued_by")}
            id="issued_by"
            type="text"
            className={styles.input}
          />
        </FormField>

        <FormField
          label="Адрес регистрации"
          id="registration_address"
          error={errors.registration_address?.message}
        >
          <input
            {...register("registration_address")}
            id="registration_address"
            type="text"
            className={styles.input}
          />
        </FormField> */}

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.saveBtn}
        >
          {isSubmitting ? "Сохранение..." : "Сохранить клиента"}
        </button>
      </form>
    </div>
  );
}
