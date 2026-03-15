import { Client } from "@/types";
import { AlertOctagon } from "lucide-react";

import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import { FoundClientBtn } from "../OrderClientSection/FoundClientBtn";

type Props = {
  foundClients: Client[];
  isSelectionActive: boolean;
  isExactMatch: boolean;
  watchedValue: string;
  isIndividual: boolean;
  normalizePhone: (value: string) => string;
  onSelect: (client: Client) => void;
};

export const FoundClientsSection = ({
  foundClients,
  isSelectionActive,
  isExactMatch,
  watchedValue,
  isIndividual,
  normalizePhone,
  onSelect,
}: Props) => {
  if (!foundClients.length || isSelectionActive) return null;

  return (
    <div className={styles.foundList}>
      <div className={styles.foundListHeader}>Найдено в базе:</div>

      {foundClients.map((client) => (
        <FoundClientBtn
          key={client.id}
          client={client}
          watchedPhone={watchedValue}
          onSelect={onSelect}
          normalizePhone={normalizePhone}
        />
      ))}

      {isExactMatch &&
        foundClients.some(
          (c) =>
            normalizePhone(c.phone ?? "") === normalizePhone(watchedValue) &&
            c.is_blacklisted,
        ) && (
          <div className={styles.warningBanner}>
            <AlertOctagon size={18} />
            <span>Внимание! Этот клиент находится в чёрном списке.</span>
          </div>
        )}
    </div>
  );
};
