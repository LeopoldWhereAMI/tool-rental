"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Skeleton from "../ui/Skeleton/Skeleton";
import Logo from "../ui/Logo/Logo";
import dynamic from "next/dynamic";
import DropdownMenu from "./DropdownMenu/DropdownMenu";
import { useSession, signOut } from "next-auth/react";
import styles from "./Header.module.css";

const ThemeToggle = dynamic(() => import("../ui/ThemeToggle/ThemeToggle"), {
  ssr: false,

  loading: () => <Skeleton width="60px" height="28px" />,
});

export default function Header() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(true);

  const user = session?.user;

  const authLoading = status === "loading";

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/profile");

      if (!response.ok) return;

      const result = await response.json();

      setAvatarUrl(result.data?.avatarUrl ?? null);
      setProfileName(result.data?.fullName ?? null);
    } catch (error) {
      console.error("Ошибка загрузки профиля:", error);
    } finally {
      setProfileLoading(false);
      setAvatarLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    loadProfile();

    const handleAvatarUpdated = () => {
      loadProfile();
    };

    window.addEventListener("avatar-updated", handleAvatarUpdated);

    return () => {
      window.removeEventListener("avatar-updated", handleAvatarUpdated);
    };
  }, [user?.id]);

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
      await signOut({
        callbackUrl: "/login",
      });

      toast.success("Вы вышли из аккаунта");
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при выходе");
    } finally {
      setLoading(false);
    }
  };

  const userName = profileName || user?.name || "Пользователь";

  const avatar =
    avatarUrl || "https://api.dicebear.com/9.x/croodles/png?seed=Aidan";

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
              {authLoading || profileLoading ? (
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
                {avatarLoading ? (
                  <Skeleton width="44px" height="44px" borderRadius="50%" />
                ) : (
                  <Image
                    src={avatar}
                    alt="Avatar"
                    width={44}
                    height={44}
                    className={styles.avatarImage}
                  />
                )}
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
