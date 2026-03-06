"use client";

import { useTheme } from "next-themes";
import styles from "./ThemeToggle.module.css";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className={styles.toggleContainer} suppressHydrationWarning>
      <button
        onClick={() => setTheme("light")}
        className={`${styles.iconBtn} ${!isDark ? styles.active : ""}`}
        title="Светлая тема"
      >
        <Sun size={16} />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`${styles.iconBtn} ${isDark ? styles.active : ""}`}
        title="Темная тема"
      >
        <Moon size={16} />
      </button>

      <div
        className={`${styles.slider} ${isDark ? styles.slideRight : styles.slideLeft}`}
      />
    </div>
  );
}
