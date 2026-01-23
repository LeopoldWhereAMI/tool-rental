"use client";

import Link from "next/link";
import styles from "./Sidebar.module.css";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  // const getLinkClass = (href: string) => {
  //   return pathname === href ? `${styles.link} ${styles.active}` : styles.link;
  // };

  return (
    <nav>
      <ul className={styles.asideNavList}>
        <li className={pathname === "/orders" ? styles.active : ""}>
          <Link href={"/orders"}>Заказы</Link>
        </li>
        <li className={pathname === "/inventory" ? styles.active : ""}>
          <Link href={"/inventory"}>Инвентарь</Link>
        </li>
        <li className={pathname === "/clients" ? styles.active : ""}>
          <Link href={"/clients"}>Клиенты</Link>
        </li>

        {/* Этих пунктов ещё нет */}
        <li className={pathname === "/analytics" ? styles.active : ""}>
          <Link href={"/analytics"}>Аналитика</Link>
        </li>
        <li className={pathname === "/dogovor" ? styles.active : ""}>
          <Link href={"/dogovor"}>Договор</Link>
        </li>
      </ul>
    </nav>
  );
}
