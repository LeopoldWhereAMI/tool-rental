import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { User, Building2 } from "lucide-react";
import { OrderInput } from "@/lib/validators/orderSchema";
import styles from "./ClientTypeSelector.module.css";

type ClientTypeSelectorProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
};

export function ClientTypeSelector<T extends FieldValues>({
  register,
}: ClientTypeSelectorProps<T>) {
  return (
    <div className={styles.clientTypeSelector}>
      <label className={styles.label}>Тип клиента</label>
      <div className={styles.clientTypeButtons}>
        <label className={styles.clientTypeLabel}>
          <input
            {...register("client_type" as Path<T>)}
            type="radio"
            value="individual"
            className={styles.radioInput}
          />
          <span className={styles.clientTypeButton}>
            <User size={16} />
            Физическое лицо
          </span>
        </label>
        <label className={styles.clientTypeLabel}>
          <input
            {...register("client_type" as Path<T>)}
            type="radio"
            value="legal"
            className={styles.radioInput}
          />
          <span className={styles.clientTypeButton}>
            <Building2 size={16} />
            Юридическое лицо
          </span>
        </label>
      </div>
    </div>
  );
}
