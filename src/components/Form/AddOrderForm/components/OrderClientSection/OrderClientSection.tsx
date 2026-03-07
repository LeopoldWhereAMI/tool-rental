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
import { AlertOctagon, Contact, MapPin, Phone, User } from "lucide-react";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import useFindClient from "./useFindClient";
import usePickClient from "./usePickClient";

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
  const watchedPhone = useWatch({ control, name: "phone" });

  const { foundClients, isExactMatch, normalizePhone } = useFindClient(
    watchedPhone,
    clients,
  );

  const { applyFoundClient, isSelectionActive } = usePickClient(
    watchedPhone,
    setValue,
    clearErrors,
  );

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
      {/* Телефон */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="phone">
          Номер телефона
        </label>
        <div className={styles.inputWithIcon}>
          <Phone size={16} />
          <input
            {...register("phone")}
            id="phone"
            type="tel"
            inputMode="tel"
            className={`${styles.input} ${errors.phone ? styles.hasError : ""}`}
            placeholder="+7 (999) 000-00-00"
          />
        </div>
        {errors.phone && (
          <span className={styles.errorText}>{errors.phone.message}</span>
        )}

        {/* Найденные клиенты */}
        <div className={styles.phoneStatus}>
          {!isSelectionActive && foundClients.length > 0 ? (
            <div className={styles.foundList}>
              <div className={styles.foundListHeader}>Найдено в базе:</div>

              {foundClients.map((client) => {
                const isBlacklisted = client.is_blacklisted; // Или client.is_blacklisted

                return (
                  <button
                    key={client.id}
                    type="button"
                    className={`${styles.foundBadge} ${isBlacklisted ? styles.blacklisted : ""}`}
                    onClick={() => applyFoundClient(client)}
                    style={
                      normalizePhone(client.phone ?? "") ===
                      normalizePhone(watchedPhone ?? "")
                        ? { borderColor: isBlacklisted ? "#ef4444" : "#2563eb" }
                        : {}
                    }
                  >
                    <User
                      size={14}
                      className={
                        isBlacklisted ? styles.errorIcon : styles.foundNameIcon
                      }
                    />
                    <span className={styles.foundName}>
                      {client.last_name} {client.first_name}
                      {isBlacklisted && (
                        <span className={styles.blacklistLabel}> (ЧС)</span>
                      )}
                    </span>
                    <span className={styles.foundPhone}>
                      {highlightPhonePrefix(
                        client.phone ?? "",
                        watchedPhone ?? "",
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : watchedPhone?.length > 10 && !isExactMatch ? (
            <span className={styles.newBadge}>
              Новый клиент — будет создан автоматически
            </span>
          ) : null}
          {isExactMatch &&
            foundClients.find(
              (c) =>
                normalizePhone(c.phone ?? "") ===
                  normalizePhone(watchedPhone) && c.is_blacklisted,
            ) && (
              <div className={styles.warningBanner}>
                <AlertOctagon size={18} />
                <span>Внимание! Этот клиент находится в чёрном списке.</span>
              </div>
            )}
        </div>
      </div>

      {/* ФИО */}
      <div className={styles.nameGrid}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="last_name">
            Фамилия
          </label>
          <input
            {...register("last_name")}
            id="last_name"
            type="text"
            className={`${styles.input} ${errors.last_name ? styles.hasError : ""}`}
            placeholder="Иванов"
          />
          {errors.last_name && (
            <span className={styles.errorText}>{errors.last_name.message}</span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="first_name">
            Имя
          </label>
          <input
            {...register("first_name")}
            id="first_name"
            type="text"
            className={`${styles.input} ${errors.first_name ? styles.hasError : ""}`}
            placeholder="Иван"
          />
          {errors.first_name && (
            <span className={styles.errorText}>
              {errors.first_name.message}
            </span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="middle_name">
            Отчество
          </label>
          <input
            {...register("middle_name")}
            id="middle_name"
            type="text"
            className={`${styles.input} ${errors.middle_name ? styles.hasError : ""}`}
            placeholder="Иванович"
          />

          {errors.middle_name && (
            <span className={styles.errorText}>
              {errors.middle_name.message}
            </span>
          )}
        </div>
      </div>

      {/* Паспортные данные */}
      <div style={{ marginTop: "24px", marginBottom: "16px" }}>
        <div className={styles.sectionTitle}>
          <Contact size={20} />
          <span className={styles.sectionNumber}>2</span>
          Паспортные данные
        </div>
      </div>

      <div className={styles.passportGrid}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="passport_series">
            Серия
          </label>
          <input
            {...register("passport_series")}
            id="passport_series"
            type="text"
            inputMode="numeric"
            maxLength={4}
            className={`${styles.input} ${errors.passport_series ? styles.hasError : ""}`}
            placeholder="0000"
          />
          {errors.passport_series && (
            <span className={styles.errorText}>
              {errors.passport_series.message}
            </span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="passport_number">
            Номер
          </label>
          <input
            {...register("passport_number")}
            id="passport_number"
            type="text"
            inputMode="numeric"
            maxLength={6}
            className={`${styles.input} ${errors.passport_number ? styles.hasError : ""}`}
            placeholder="000000"
          />
          {errors.passport_number && (
            <span className={styles.errorText}>
              {errors.passport_number.message}
            </span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="issue_date">
            Дата выдачи
          </label>
          <input
            {...register("issue_date")}
            id="issue_date"
            type="date"
            className={`${styles.input} ${errors.issue_date ? styles.hasError : ""}`}
          />
          {errors.issue_date && (
            <span className={styles.errorText}>
              {errors.issue_date.message}
            </span>
          )}
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="issued_by">
          Кем выдан (орган)
        </label>
        <input
          {...register("issued_by")}
          id="issued_by"
          type="text"
          className={`${styles.input} ${errors.issued_by ? styles.hasError : ""}`}
          placeholder="УФМС по городу..."
        />
        {errors.issued_by && (
          <span className={styles.errorText}>{errors.issued_by.message}</span>
        )}
      </div>

      {/* Адрес */}
      <div style={{ marginTop: "24px", marginBottom: "16px" }}>
        <div className={styles.sectionTitle}>
          <MapPin size={20} />
          <span className={styles.sectionNumber}>3</span>
          Адрес регистрации
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="registration_address">
          Полный адрес постоянной регистрации
        </label>
        <textarea
          {...register("registration_address")}
          id="registration_address"
          className={`${styles.textarea} ${errors.registration_address ? styles.hasError : ""}`}
          placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
        />
        {errors.registration_address && (
          <span className={styles.errorText}>
            {errors.registration_address.message}
          </span>
        )}
      </div>
    </>
  );
}
