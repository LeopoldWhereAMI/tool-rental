import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  useWatch,
  Control,
} from "react-hook-form";
import { OrderInput } from "@/lib/validators/orderSchema";
import { Contact, MapPin } from "lucide-react";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import { suggestAddress, suggestFio, suggestFmsUnit } from "@/services/dadata";
import { useDadataSuggestions } from "@/hooks/useDadataSuggestions";
import { SuggestionField } from "@/components/ui/SuggestionField/SuggestionField";

interface IndividualFieldsProps {
  register: UseFormRegister<OrderInput>;
  errors: FieldErrors<OrderInput>;
  control: Control<OrderInput>;
  setValue: UseFormSetValue<OrderInput>;
}

export const IndividualFields = ({
  register,
  errors: errorsProp,
  control,
  setValue,
}: IndividualFieldsProps) => {
  const errors = errorsProp as FieldErrors<
    Extract<OrderInput, { client_type: "individual" }>
  >;

  if (!control) {
    throw new Error(
      "IndividualFields must be used within a Hook Form context or receive control prop",
    );
  }

  const formValues = useWatch({
    control,
    // Перечисляем только те поля, которые триггерят подсказки
    name: [
      "registration_address",
      "issued_by",
      "last_name",
      "first_name",
      "middle_name",
    ],
  });

  const [regAddr, issuedBy, lastName, firstName, middleName] = formValues;

  const {
    suggestions: addrSugg,
    isLoading: addrLoading,
    handleSelect: onAddrSelect,
  } = useDadataSuggestions({
    searchValue: regAddr,
    fieldName: "registration_address",
    setValue,
    suggestFn: suggestAddress,
  });

  const {
    suggestions: fmsSugg,
    isLoading: fmsLoading,
    handleSelect: onFmsSelect,
  } = useDadataSuggestions({
    searchValue: issuedBy,
    fieldName: "issued_by",
    setValue,
    suggestFn: suggestFmsUnit,
    minChars: 2,
  });

  // Подсказки для Фамилии
  const { suggestions: surnameSugg, handleSelect: onSurnameSelect } =
    useDadataSuggestions({
      searchValue: lastName,
      fieldName: "last_name",
      setValue,
      suggestFn: (q) => suggestFio(q, ["SURNAME"]), // Ищем только фамилии
    });

  // Подсказки для Имени
  const { suggestions: nameSugg, handleSelect: onNameSelect } =
    useDadataSuggestions({
      searchValue: firstName,
      fieldName: "first_name",
      setValue,
      suggestFn: (q) => suggestFio(q, ["NAME"]), // Ищем только имена
    });

  // ОТЧЕСТВО (НОВОЕ)
  const { suggestions: patronymicSugg, handleSelect: onPatronymicSelect } =
    useDadataSuggestions({
      searchValue: middleName,
      fieldName: "middle_name",
      setValue,
      suggestFn: (q) => suggestFio(q, ["PATRONYMIC"]),
    });

  return (
    <>
      <div className={styles.nameGrid}>
        <SuggestionField
          label="Фамилия"
          suggestions={surnameSugg}
          onSelect={(s) => onSurnameSelect(s.value)}
          getLabel={(s) => s.value}
          renderInput={() => (
            <input
              {...register("last_name")}
              className={styles.input}
              placeholder="Иванов"
            />
          )}
        />

        <SuggestionField
          label="Имя"
          suggestions={nameSugg}
          onSelect={(s) => onNameSelect(s.value)}
          getLabel={(s) => s.value}
          renderInput={() => (
            <input
              {...register("first_name")}
              className={styles.input}
              placeholder="Иван"
            />
          )}
        />

        <SuggestionField
          label="Отчество"
          suggestions={patronymicSugg}
          onSelect={(s) => onPatronymicSelect(s.value)}
          getLabel={(s) => s.value}
          renderInput={() => (
            <input
              {...register("middle_name")}
              className={`${styles.input} ${errors.middle_name ? styles.hasError : ""}`}
              placeholder="Иванович"
            />
          )}
        />
      </div>

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

      <SuggestionField
        label="Кем выдан (орган)"
        isLoading={fmsLoading}
        suggestions={fmsSugg}
        getLabel={(s) => s.value}
        onSelect={(s) => onFmsSelect(s.value)}
        renderInput={() => (
          <input
            {...register("issued_by")}
            className={`${styles.input} ${errors.issued_by ? styles.hasError : ""}`}
            placeholder="Начните вводить код подразделения..."
            autoComplete="off"
          />
        )}
      />

      <div style={{ marginTop: "24px", marginBottom: "16px" }}>
        <div className={styles.sectionTitle}>
          <MapPin size={20} />
          <span className={styles.sectionNumber}>3</span>
          Адрес регистрации
        </div>
      </div>

      <SuggestionField
        label="Полный адрес"
        isLoading={addrLoading}
        suggestions={addrSugg}
        getLabel={(s) => s.value}
        onSelect={(s) => onAddrSelect(s.value)}
        renderInput={() => (
          <textarea
            {...register("registration_address")}
            className={`${styles.textarea} ${errors.registration_address ? styles.hasError : ""}`}
            placeholder="г. Москва, ул. Ленина..."
            rows={2}
          />
        )}
      />
    </>
  );
};
