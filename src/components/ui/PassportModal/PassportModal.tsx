import FormField from "@/components/Form/FormField/FormField";
import styles from "./PassportModal.module.css";
import { FileText, X } from "lucide-react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { PassportInput } from "@/lib/validators/orderSchema";
import { useDadataSuggestions } from "@/hooks/useDadataSuggestions";
import { suggestAddress, suggestFmsUnit } from "@/services/dadata";
import { SuggestionField } from "../SuggestionField/SuggestionField";

type PassportModalProps = {
  onPassportSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  register: UseFormRegister<PassportInput>;
  errors: FieldErrors<PassportInput>;
  control: Control<PassportInput>; // Добавили
  setValue: UseFormSetValue<PassportInput>;
};

export default function PassportModal({
  onPassportSubmit,
  onClose,
  register,
  errors,
  control,
  setValue,
}: PassportModalProps) {
  const {
    suggestions: fmsSugg,
    isLoading: fmsLoading,
    handleSelect: onFmsSelect,
  } = useDadataSuggestions({
    searchValue: useWatch({ control, name: "issued_by" }),
    fieldName: "issued_by",
    setValue,
    suggestFn: suggestFmsUnit,
    minChars: 2,
  });

  // Подсказки для адреса
  const {
    suggestions: addrSugg,
    isLoading: addrLoading,
    handleSelect: onAddrSelect,
  } = useDadataSuggestions({
    searchValue: useWatch({ control, name: "registration_address" }),
    fieldName: "registration_address",
    setValue,
    suggestFn: suggestAddress,
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <FileText size={22} className={styles.headerIcon} />
          <h3>Данные для договора</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onPassportSubmit} className={styles.passportForm}>
          <div className={styles.modalGrid}>
            <FormField
              label="Серия"
              id="passport_series"
              error={errors.passport_series?.message}
            >
              <input
                {...register("passport_series")}
                placeholder="0000"
                maxLength={4}
                className={styles.input}
              />
            </FormField>
            <FormField
              label="Номер"
              id="passport_number"
              error={errors.passport_number?.message}
            >
              <input
                {...register("passport_number")}
                placeholder="000000"
                maxLength={6}
                className={styles.input}
              />
            </FormField>
            <FormField
              label="Дата выдачи"
              id="issue_date"
              error={errors.issue_date?.message}
            >
              <input
                type="date"
                {...register("issue_date")}
                className={styles.input}
              />
            </FormField>
          </div>

          <FormField
            label="Кем выдан"
            id="issued_by"
            error={errors.issued_by?.message}
          >
            <SuggestionField
              isLoading={fmsLoading}
              suggestions={fmsSugg}
              getLabel={(s) => s.value}
              onSelect={(s) => onFmsSelect(s.value)}
              renderInput={() => (
                <input
                  {...register("issued_by")}
                  placeholder="Начните вводить название или код..."
                  className={styles.input}
                  autoComplete="off"
                />
              )}
            />
          </FormField>

          <FormField
            label="Адрес регистрации"
            id="registration_address"
            error={errors.registration_address?.message}
          >
            <SuggestionField
              isLoading={addrLoading}
              suggestions={addrSugg}
              getLabel={(s) => s.value}
              onSelect={(s) => onAddrSelect(s.value)}
              renderInput={() => (
                <input
                  {...register("registration_address")}
                  placeholder="г. Москва..."
                  className={styles.input}
                  autoComplete="off"
                />
              )}
            />
          </FormField>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Отмена
            </button>
            <button type="submit" className={styles.submitBtn}>
              Подтвердить и печать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
