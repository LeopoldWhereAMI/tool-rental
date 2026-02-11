import Link from "next/link";
import styles from "./Header.module.css";
import { PlusCircle, PackagePlus, UserCircle } from "lucide-react"; // Добавим иконки
import Logo from "../ui/Logo/Logo";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLogo}>
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className={styles.headerContent}>
        <nav className={styles.navActions}>
          <Link
            href={"/orders/add"}
            className={`${styles.btn} ${styles.primary}`}
            title="Создать заказ"
          >
            <PlusCircle size={18} />
            <span>Создать заказ</span>
          </Link>

          <Link
            href={"/inventory/add"}
            className={`${styles.btn} ${styles.secondary}`}
            title="Создать инструмент"
          >
            <PackagePlus size={18} />
            <span>Создать инструмент</span>
          </Link>
        </nav>

        {/* <div className={styles.profile}>
          <UserCircle size={24} className={styles.icon} />
          <span>Профиль</span>
        </div> */}
      </div>
    </header>
  );
}
