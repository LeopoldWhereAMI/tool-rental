"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Wrench, Users, BarChart3 } from "lucide-react";
import styles from "./MobileNav.module.css";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/orders", label: "Заказы", icon: ClipboardList },
  { href: "/inventory", label: "Инвентарь", icon: Wrench },
  { href: "/clients", label: "Клиенты", icon: Users },
  { href: "/finances", label: "Финансы", icon: BarChart3 },
];

export default function MobileNav() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      // Проверяем, что фокус именно на поле ввода
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        setIsVisible(false);
      }
    };

    const handleFocusOut = () => {
      setIsVisible(true);
    };

    // Слушаем события фокуса на всей странице
    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);

    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  // Если клавиатура открыта — не рендерим (или скрываем через CSS)
  if (!isVisible) return null;

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
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
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
