"use client";

import styles from "./Header.module.css";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { logoutAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabase";
import { AuthUser } from "@/types";
import Image from "next/image";
import Skeleton from "../ui/Skeleton/Skeleton";
import Logo from "../ui/Logo/Logo";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser((user as AuthUser) || null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser((session?.user as AuthUser) || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const result = await logoutAction();
      if (result.success) {
        toast.success("Вы вышли из аккаунта");
        setUser(null);
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Ошибка при выходе");
    } finally {
      setLoading(false);
    }
  };

  const userEmail = user?.email || "Пользователь";

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoWrapper}>
          <Logo />
        </div>

        <div className={styles.rightSection}>
          <button className={styles.notificationBtn}>
            <Bell size={22} />
            <span className={styles.notificationBadge}></span>
          </button>

          <div className={styles.divider}></div>

          <div className={styles.profileSection} ref={dropdownRef}>
            <button
              className={styles.profileButton}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={loading}
            >
              {isInitialLoading ? (
                <div className={styles.profileInfo}>
                  {/* Скелетон для Email */}
                  <Skeleton
                    width="110px"
                    height="14px"
                    className={styles.skeletonMargin}
                  />
                  {/* Скелетон для Роли */}
                  <Skeleton width="80px" height="10px" borderRadius="3px" />
                </div>
              ) : (
                <div className={styles.profileInfo}>
                  <p className={styles.userName}>{userEmail}</p>
                  <p className={styles.userRole}>Администратор</p>
                </div>
              )}
              <div className={styles.avatarWrapper}>
                <Image
                  src="https://api.dicebear.com/7.x/personas/svg?seed=Alex&backgroundColor=b6e3f4,c0aede,d1d4f9"
                  alt="Profile"
                  fill
                  className={styles.avatarImage}
                  unoptimized
                />
              </div>
              <ChevronDown
                size={16}
                className={`${styles.chevron} ${dropdownOpen ? styles.chevronActive : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <p className={styles.dropdownEmail}>{userEmail}</p>
                </div>
                <div className={styles.dropdownDivider}></div>
                <button
                  className={styles.dropdownItemLogout}
                  onClick={handleLogout}
                  disabled={loading}
                >
                  <LogOut size={16} />
                  {loading ? "Выход..." : "Выход"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
