import { User, Building2 } from "lucide-react";
import { Client } from "@/types";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";

interface FoundClientBadgeProps {
  client: Client;
  watchedPhone: string;
  onSelect: (client: Client) => void;
  normalizePhone: (phone: string) => string;
}

export const FoundClientBtn = ({
  client,
  watchedPhone,
  onSelect,
  normalizePhone,
}: FoundClientBadgeProps) => {
  const isBlacklisted = client.is_blacklisted;
  const isIndividual = client.client_type === "individual";

  const displayName = isIndividual
    ? `${client.last_name} ${client.first_name}`
    : client.company_name;

  const isActive =
    normalizePhone(client.phone ?? "") === normalizePhone(watchedPhone ?? "");

  const highlightPhonePrefix = (phone: string, input: string) => {
    const cleanPhone = normalizePhone(phone);
    const cleanInput = normalizePhone(input);
    if (cleanInput.length < 6) return phone;
    const prefix = cleanPhone.slice(0, 6);
    const rest = cleanPhone.slice(6);
    return (
      <>
        <span className={styles.match}>{prefix}</span>
        {rest}
      </>
    );
  };

  return (
    <button
      type="button"
      className={`${styles.foundBadge} ${isBlacklisted ? styles.blacklisted : ""}`}
      onClick={() => onSelect(client)}
      style={
        isActive ? { borderColor: isBlacklisted ? "#ef4444" : "#2563eb" } : {}
      }
    >
      {isIndividual ? (
        <User
          size={14}
          className={isBlacklisted ? styles.errorIcon : styles.foundNameIcon}
        />
      ) : (
        <Building2
          size={14}
          className={isBlacklisted ? styles.errorIcon : styles.foundNameIcon}
        />
      )}
      <span className={styles.foundName}>
        {displayName}
        {isBlacklisted && <span className={styles.blacklistLabel}> (ЧС)</span>}
      </span>
      <span className={styles.foundPhone}>
        {highlightPhonePrefix(client.phone ?? "", watchedPhone ?? "")}
      </span>
    </button>
  );
};
