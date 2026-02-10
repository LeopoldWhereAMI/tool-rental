"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Wrench,
  Users,
  BarChart3,
  FileText,
} from "lucide-react";
import styles from "./MobileNav.module.css";

const navItems = [
  { href: "/orders", label: "Заказы", icon: ClipboardList },
  { href: "/inventory", label: "Инвентарь", icon: Wrench },
  { href: "/clients", label: "Клиенты", icon: Users },
  { href: "/analytics", label: "Анализ", icon: BarChart3 },
  { href: "/dogovor", label: "Договор", icon: FileText },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.container}>
      <ul className={styles.list}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.link} ${isActive ? styles.active : ""}`}
              >
                <div className={styles.activePill}>
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  <span className={styles.label}>{item.label}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
