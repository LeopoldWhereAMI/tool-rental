import { Box, SearchX } from "lucide-react";
import styles from "./EmptyBlock.module.css";

type EmptyStateProps = {
  message?: string;
  isSearch?: boolean;
};

export default function EmptyBlock({
  message = "Данные не найдены",
  isSearch = false,
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        {isSearch ? <SearchX size={40} /> : <Box size={40} />}
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
