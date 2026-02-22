"use client";

import { useHeaderStore } from "@/app/store/store";
import styles from "./Header.module.css";
import { Bell } from "lucide-react";
import Image from "next/image";
import SearchInput from "../SearchInput/SearchInput";

export default function Header() {
  const { title, subtitle, actions, query, setQuery, customSearch } =
    useHeaderStore();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.searchWrapper}>
          {customSearch ? (
            customSearch
          ) : (
            <SearchInput value={query} setSearch={setQuery} />
          )}
        </div>

        <div className={styles.pageInfo}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {/* 2. Центр/Право: Кнопки действий */}
        <nav className={styles.navActions}>{actions}</nav>

        {/* 3. Справа: Уведомления и Профиль */}
        <div className={styles.rightSection}>
          <button className={styles.notificationBtn}>
            <Bell size={22} />
            <span className={styles.notificationBadge}></span>
          </button>

          <div className={styles.divider}></div>

          <div className={styles.profileInfo}>
            <div className={styles.profileText}>
              <p className={styles.userName}>Максим Голубев</p>
              <p className={styles.userRole}>Генеральный директор</p>
            </div>
            <div className={styles.avatarWrapper}>
              <Image
                src="https://api.dicebear.com/7.x/personas/svg?seed=Alex&backgroundColor=b6e3f4,c0aede,d1d4f9"
                alt="Profile"
                fill
                className={styles.avatarImage}
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
