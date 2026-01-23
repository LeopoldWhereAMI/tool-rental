import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLogo}>Аренда инструмента</div>
      <div className={styles.headerContent}>
        <Link href={"/orders/add"} className={styles.headerBtn}>
          Создать заказ
        </Link>
        <div>Профиль</div>
      </div>
    </header>
  );
}
