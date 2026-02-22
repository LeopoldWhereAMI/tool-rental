import Link from "next/link";
import Navigation from "./Navigation/Navigation";
import styles from "./Sidebar.module.css";
import Logo from "../ui/Logo/Logo";

export default function Sidebar() {
  return (
    <aside className={styles.aside}>
      <div className={styles.logo}>
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <Navigation />
    </aside>
  );
}
