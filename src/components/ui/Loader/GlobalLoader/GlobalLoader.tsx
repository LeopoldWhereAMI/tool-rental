import { Loader2 } from "lucide-react";
import styles from "./GlobalLoader.module.css";

export default function GlobalLoader() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <div className={styles.brandIcon}>🛠️</div>
          <span className={styles.brandName}>
            SKLAD<strong>APP</strong>
          </span>
        </div>
        <div className={styles.spinnerWrapper}>
          <Loader2 className={styles.spinner} size={32} />
        </div>
      </div>
    </div>
  );
}
