import { Loader2 } from "lucide-react";
import styles from "./Loader.module.css";

type LoaderProps = {
  size?: number;
  label?: string;
  fullPage?: boolean;
};

export default function Loader({
  size = 24,
  label = "Загрузка...",
  fullPage = false,
}: LoaderProps) {
  const content = (
    <div className={styles.loaderContainer}>
      <Loader2 size={size} className={styles.spinner} />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );

  if (fullPage) {
    return <div className={styles.overlay}>{content}</div>;
  }

  return content;
}
