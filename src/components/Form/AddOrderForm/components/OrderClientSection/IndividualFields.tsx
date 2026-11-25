import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  useWatch,
  Control,
  FieldValues,
  Path,
} from "react-hook-form";
import { ClientFormInput } from "@/lib/validators/clientSchema";
import { useDadataSuggestions } from "@/hooks/useDadataSuggestions";
import { suggestAddress, suggestFio, suggestFmsUnit } from "@/services/dadata";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import { SuggestionField } from "@/components/ui/SuggestionField/SuggestionField";
import { Contact, MapPin } from "lucide-react";

// Выносим тип отдельно — никакой многострочной дженерик-конструкции в теле функции
type IndividualClientErrors = FieldErrors<
  Extract<ClientFormInput, { client_type: "individual" }>
>;

interface IndividualFieldsProps<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  control: Control<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
}

export function IndividualFields<TFieldValues extends FieldValues>({
  register,
  errors: errorsProp,
  control,
  setValue,
}: IndividualFieldsProps<TFieldValues>) {
  const errors = errorsProp as unknown as IndividualClientErrors;

  const formValues = useWatch({
    control,
    name: [
      "registration_address",
      "issued_by",
      "last_name",
      "first_name",
      "middle_name",
    ] as Path<TFieldValues>[],
  });

  const [regAddr, issuedBy, lastName, firstName, middleName] =
    formValues as unknown as [
      string,
      string,
      string,
      string,
      string | undefined,
    ];

  const {
    suggestions: addrSugg,
    isLoading: addrLoading,
    handleSelect: onAddrSelect,
  } = useDadataSuggestions({
    searchValue: regAddr,
    fieldName: "registration_address" as Path<TFieldValues>,
    setValue,
    suggestFn: suggestAddress,
  });

  const {
    suggestions: fmsSugg,
    isLoading: fmsLoading,
    handleSelect: onFmsSelect,
  } = useDadataSuggestions({
    searchValue: issuedBy,
    fieldName: "issued_by" as Path<TFieldValues>,
    setValue,
    suggestFn: suggestFmsUnit,
    minChars: 2,
  });

  const { suggestions: surnameSugg, handleSelect: onSurnameSelect } =
    useDadataSuggestions({
      searchValue: lastName,
      fieldName: "last_name" as Path<TFieldValues>,
      setValue,
      suggestFn: (q) => suggestFio(q, ["SURNAME"]),
    });

  const { suggestions: nameSugg, handleSelect: onNameSelect } =
    useDadataSuggestions({
      searchValue: firstName,
      fieldName: "first_name" as Path<TFieldValues>,
      setValue,
      suggestFn: (q) => suggestFio(q, ["NAME"]),
    });

  const { suggestions: patronymicSugg, handleSelect: onPatronymicSelect } =
    useDadataSuggestions({
      searchValue: middleName,
      fieldName: "middle_name" as Path<TFieldValues>,
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
              {...register("last_name" as Path<TFieldValues>)}
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
              {...register("first_name" as Path<TFieldValues>)}
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
              {...register("middle_name" as Path<TFieldValues>)}
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
            {...register("passport_series" as Path<TFieldValues>)}
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
            {...register("passport_number" as Path<TFieldValues>)}
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
            {...register("issue_date" as Path<TFieldValues>)}
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
            {...register("issued_by" as Path<TFieldValues>)}
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
            {...register("registration_address" as Path<TFieldValues>)}
            className={`${styles.textarea} ${errors.registration_address ? styles.hasError : ""}`}
            placeholder="г. Москва, ул. Ленина..."
            rows={2}
          />
        )}
      />
    </>
  );
}
