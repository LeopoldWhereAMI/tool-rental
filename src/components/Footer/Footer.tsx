import styles from "./Footer.module.css";
import { version } from "../../../package.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <span className={styles.copyright}>
          © {currentYear} Система управления прокатом.
        </span>

        <span className={styles.status}>v {version} - beta</span>
      </div>
    </footer>
  );
}
