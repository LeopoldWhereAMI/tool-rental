import { UseFormRegister, FieldErrors } from "react-hook-form";
import { OrderInput } from "@/lib/validators/orderSchema";
import { Building2, MapPin } from "lucide-react";
import Spinner from "@/components/ui/Spinner/Spinner";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";

interface CompanyFieldsProps {
  register: UseFormRegister<OrderInput>;
  errors: FieldErrors<OrderInput>;
  isSearching: boolean;
}

const InputSpinner = ({
  isSearching,
  className,
}: {
  isSearching: boolean;
  className?: string;
}) => {
  if (!isSearching) return null;

  return (
    <div className={`${styles.innSpinner} ${className || ""}`}>
      <Spinner size={16} />
    </div>
  );
};

export const CompanyFields = ({
  register,
  errors: errorsProp,
  isSearching,
}: CompanyFieldsProps) => {
  const errors = errorsProp as FieldErrors<
    Extract<OrderInput, { client_type: "legal" }>
  >;

  return (
    <>
      <div style={{ marginTop: "24px", marginBottom: "16px" }}>
        <div className={styles.sectionTitle}>
          <Building2 size={20} />
          <span className={styles.sectionNumber}>2</span>
          Реквизиты компании
        </div>
      </div>

      {/* Название компании */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="company_name">
          Название компании
        </label>
        <div style={{ position: "relative" }}>
          <input
            {...register("company_name")}
            id="company_name"
            readOnly={isSearching}
            className={`${styles.input} ${errors.company_name ? styles.hasError : ""}`}
            placeholder="ООО 'Компания'"
          />
          <InputSpinner isSearching={isSearching} />
        </div>
        {errors.company_name && (
          <span className={styles.errorText}>
            {errors.company_name.message}
          </span>
        )}
      </div>

      <div className={styles.passportGrid}>
        {/* ИНН */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="inn">
            ИНН
          </label>
          <div style={{ position: "relative" }}>
            <input
              {...register("inn")}
              id="inn"
              inputMode="numeric"
              maxLength={10}
              className={`${styles.input} ${errors.inn ? styles.hasError : ""}`}
              placeholder="1234567891"
            />
            <InputSpinner isSearching={isSearching} />
          </div>
          {errors.inn && (
            <span className={styles.errorText}>{errors.inn.message}</span>
          )}
        </div>

        {/* КПП */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="kpp">
            КПП
          </label>
          <div style={{ position: "relative" }}>
            <input
              {...register("kpp")}
              id="kpp"
              readOnly={isSearching}
              className={`${styles.input} ${errors.kpp ? styles.hasError : ""}`}
            />
            <InputSpinner isSearching={isSearching} />
          </div>
          {errors.kpp && (
            <span className={styles.errorText}>{errors.kpp.message}</span>
          )}
        </div>

        {/* ОГРН */}
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="ogrn">
            ОГРН
          </label>
          <div style={{ position: "relative" }}>
            <input
              {...register("ogrn")}
              id="ogrn"
              readOnly={isSearching}
              className={`${styles.input} ${errors.ogrn ? styles.hasError : ""}`}
            />
            <InputSpinner isSearching={isSearching} />
          </div>
          {errors.ogrn && (
            <span className={styles.errorText}>{errors.ogrn.message}</span>
          )}
        </div>
      </div>

      <div style={{ marginTop: "24px", marginBottom: "16px" }}>
        <div className={styles.sectionTitle}>
          <MapPin size={20} />
          <span className={styles.sectionNumber}>3</span>
          Адрес
        </div>
      </div>

      {/* Адрес */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="legal_address">
          Юридический адрес
        </label>
        <div style={{ position: "relative" }}>
          <textarea
            {...register("legal_address")}
            id="legal_address"
            readOnly={isSearching}
            className={`${styles.textarea} ${errors.legal_address ? styles.hasError : ""}`}
            placeholder="г. Москва, ул. Ленина, д. 1"
          />
          <InputSpinner
            isSearching={isSearching}
            className={styles.spinnerTop}
          />
        </div>
        {errors.legal_address && (
          <span className={styles.errorText}>
            {errors.legal_address.message}
          </span>
        )}
      </div>
    </>
  );
};
