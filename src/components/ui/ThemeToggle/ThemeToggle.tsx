"use client";

import { useTheme } from "next-themes";
import styles from "./ThemeToggle.module.css";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      suppressHydrationWarning
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={styles.themeBtn}
      title={isDark ? "Активировать светлую тему" : "Активировать темную тему"}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
