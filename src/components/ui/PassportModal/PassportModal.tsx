import FormField from "@/components/Form/FormField/FormField";
import styles from "./PassportModal.module.css";
import { X } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { PassportInput } from "@/lib/validators/orderSchema";

type PassportModalProps = {
  onPassportSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
  register: UseFormRegister<PassportInput>;
  errors: FieldErrors<PassportInput>;
};

export default function PassportModal({
  onPassportSubmit,
  onClose,
  register,
  errors,
}: PassportModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Данные для договора</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onPassportSubmit}>
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
            <input
              {...register("issued_by")}
              placeholder="УФМС..."
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
              placeholder="г. Москва..."
              className={styles.input}
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
