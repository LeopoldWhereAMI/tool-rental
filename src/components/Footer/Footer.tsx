import styles from "./Footer.module.css";
import Logo from "../ui/Logo/Logo";
import { version } from "../../../package.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Logo />
          <span className={styles.copyright}>
            © {currentYear} Система управления прокатом.
          </span>
        </div>

        <div className={styles.status}>v {version} - beta</div>
      </div>
    </footer>
  );
}
