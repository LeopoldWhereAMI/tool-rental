"use client";

import styles from "./Header.module.css";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { logoutAction } from "@/app/actions/auth";
import { toast } from "sonner";
import Image from "next/image";
import Skeleton from "../ui/Skeleton/Skeleton";
import Logo from "../ui/Logo/Logo";
import dynamic from "next/dynamic";
import { useAuth } from "@/providers/AuthProvider";
import DropdownMenu from "./DropdownMenu/DropdownMenu";

const ThemeToggle = dynamic(() => import("../ui/ThemeToggle/ThemeToggle"), {
  ssr: false,

  loading: () => <Skeleton width="60px" height="28px" />,
});

export default function Header() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Ошибка при выходе");
    } finally {
      setLoading(false);
    }
  };

  const userName = profile?.full_name || user?.email;

  const avatar =
    profile?.avatar_url ||
    "https://api.dicebear.com/9.x/croodles/png?seed=Aidan";

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoWrapper}>
          <Logo />
        </div>

        <div className={styles.rightSection}>
          <ThemeToggle />

          <div className={styles.divider}></div>

          <div className={styles.profileSection} ref={dropdownRef}>
            <button
              className={styles.profileButton}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={loading}
            >
              {authLoading ? (
                <div className={styles.profileInfo}>
                  <Skeleton
                    width="110px"
                    height="14px"
                    className={styles.skeletonMargin}
                  />

                  <Skeleton width="80px" height="10px" borderRadius="3px" />
                </div>
              ) : (
                <div className={styles.profileInfo}>
                  <p className={styles.userName}>{userName}</p>
                  <p className={styles.userRole}>Администратор</p>
                </div>
              )}
              <div className={styles.avatarWrapper}>
                <Image
                  src={avatar}
                  alt="Avatar"
                  width={44}
                  height={44}
                  className={styles.avatarImage}
                />
              </div>
              <ChevronDown
                size={16}
                className={`${styles.chevron} ${dropdownOpen ? styles.chevronActive : ""}`}
              />
            </button>

            {dropdownOpen && (
              <DropdownMenu
                onClose={() => setDropdownOpen(false)}
                userId={user?.id}
                handleLogout={handleLogout}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
