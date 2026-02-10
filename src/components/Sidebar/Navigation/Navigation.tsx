"use client";

import Link from "next/link";
import styles from "../Sidebar.module.css";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Wrench,
  Users,
  BarChart3,
  FileText,
} from "lucide-react";

const navItems = [
  { href: "/orders", label: "Заказы", icon: ClipboardList },
  { href: "/inventory", label: "Инвентарь", icon: Wrench },
  { href: "/clients", label: "Клиенты", icon: Users },
  { href: "/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/dogovor", label: "Договор", icon: FileText },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <ul className={styles.asideNavList}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.href} className={isActive ? styles.active : ""}>
              <Link
                href={item.href}
                className={styles.navLink}
                title={item.label}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
