import { OrderInput } from "@/lib/validators/orderSchema";
import { Client } from "@/types";
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";

import { Calendar, FileText, MapPin, Phone, User } from "lucide-react";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import useFindClient from "./useFindClient";
import usePickClient from "./usePickClient";
import InputWithIcon from "@/components/Form/InventoryForm/InputWithIcon";
import FormField from "@/components/Form/FormField/FormField";

type OrderClientSectionProps = {
  register: UseFormRegister<OrderInput>;
  errors: FieldErrors<OrderInput>;
  control: Control<OrderInput>;
  setValue: UseFormSetValue<OrderInput>;
  clearErrors: UseFormClearErrors<OrderInput>;
  clients: Client[];
};

export default function OrderClientSection({
  register,
  errors,
  control,
  setValue,
  clearErrors,
  clients,
}: OrderClientSectionProps) {
  // Наблюдаем за телефоном внутри секции
  const watchedPhone = useWatch({ control, name: "phone" });

  // Логика поиска клиента
  const { foundClients, isExactMatch, normalizePhone } = useFindClient(
    watchedPhone,
    clients,
  );

  // Логика выбора клиента
  const { applyFoundClient, isSelectionActive } = usePickClient(
    watchedPhone,
    setValue,
    clearErrors,
  );

  // Подсветка совпавшей части номера телефона
  const highlightPhonePrefix = (phone: string, input: string) => {
    const cleanPhone = normalizePhone(phone);
    const cleanInput = normalizePhone(input);

    if (cleanInput.length < 7) return phone;

    const prefix = cleanPhone.slice(0, 7);
    const rest = cleanPhone.slice(7);

    return (
      <>
        <span className={styles.match}>{prefix}</span>
        {rest}
      </>
    );
  };

  return (
    <>
      <h2 className={styles.sectionTitle}>
        <User size={20} /> Информация о клиенте
      </h2>

      <div className={styles.clientInfoContainer}>
        <FormField label="Телефон" id="phone" error={errors.phone?.message}>
          <InputWithIcon
            type="tel"
            inputMode="tel"
            icon={Phone}
            error={!!errors.phone}
            placeholder="8 (999) 000-00-00"
            register={register("phone")}
          />

          {/* Подсказка о наличии клиента в базе */}
          <div className={styles.phoneStatus}>
            {!isSelectionActive && foundClients.length > 0 ? (
              <div className={styles.foundList}>
                <div className={styles.foundListHeader}>Найдены в базе:</div>
                {foundClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    className={styles.foundBadge}
                    onClick={() => applyFoundClient(client)}
                    style={
                      normalizePhone(client.phone ?? "") ===
                      normalizePhone(watchedPhone ?? "")
                        ? { borderColor: "#2563eb", background: "#eff6ff" }
                        : {}
                    }
                  >
                    <User size={14} />
                    <span className={styles.foundName}>
                      {client.last_name} {client.first_name}
                    </span>
                    <span className={styles.foundPhone}>
                      {highlightPhonePrefix(
                        client.phone ?? "",
                        watchedPhone ?? "",
                      )}
                    </span>
                  </button>
                ))}
              </div>
            ) : watchedPhone?.length > 10 && !isExactMatch ? (
              <span className={styles.newBadge}>
                Новый клиент (будет создан автоматически)
              </span>
            ) : null}
          </div>
        </FormField>
      </div>

      <div className={styles.nameGrid}>
        <FormField
          label="Фамилия"
          id="last_name"
          error={errors.last_name?.message}
        >
          <input
            {...register("last_name")}
            id="last_name"
            type="text"
            className={styles.input}
            placeholder="Иванов"
          />
        </FormField>
        <FormField
          label="Имя"
          id="first_name"
          error={errors.first_name?.message}
        >
          <input
            {...register("first_name")}
            id="first_name"
            type="text"
            className={styles.input}
            placeholder="Иван"
          />
        </FormField>
        <FormField
          label="Отчество"
          id="middle_name"
          error={errors.middle_name?.message}
        >
          <input
            {...register("middle_name")}
            id="middle_name"
            type="text"
            className={styles.input}
            placeholder="Иванович"
          />
        </FormField>
      </div>

      {/* СЕКЦИЯ: ПАСПОРТ */}

      <h2 className={styles.sectionTitle}>
        <FileText size={20} /> Паспортные данные
      </h2>
      <div className={styles.passportGrid}>
        <FormField
          label="Серия"
          id="passport_series"
          error={errors.passport_series?.message}
        >
          <input
            {...register("passport_series")}
            id="passport_series"
            type="text"
            inputMode="numeric"
            maxLength={4}
            className={styles.input}
            placeholder="0000"
          />
        </FormField>
        <FormField
          label="Номер"
          id="passport_number"
          error={errors.passport_number?.message}
        >
          <input
            {...register("passport_number")}
            id="passport_number"
            type="text"
            inputMode="numeric"
            maxLength={6}
            className={styles.input}
            placeholder="000000"
          />
        </FormField>
        <FormField
          label="Дата выдачи"
          id="issue_date"
          error={errors.issue_date?.message}
        >
          <InputWithIcon
            type="date"
            id="issue_date"
            icon={Calendar}
            register={register("issue_date")}
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
          placeholder="УФМС по городу..."
        />
      </FormField>

      <FormField
        label="Адрес регистрации"
        id="registration_address"
        error={errors.registration_address?.message}
      >
        <InputWithIcon
          type="text"
          id="registration_address"
          placeholder="г. Москва, ул. Ленина..."
          icon={MapPin}
          register={register("registration_address")}
        />
      </FormField>
    </>
  );
}
