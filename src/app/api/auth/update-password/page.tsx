"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import styles from "./page.module.css";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Пароль должен быть не менее 6 символов");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast.success("Пароль успешно изменён");
      router.push("/login");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Ошибка";
      toast.error("Ошибка: " + msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { searchParams } = new URL(window.location.href);
    const code = searchParams.get("code");

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) toast.error("Ссылка недействительна или устарела");
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Новый пароль</h1>
        <p className={styles.subtitle}>
          Введите новый пароль для вашего аккаунта
        </p>

        <div className={styles.formGroup}>
          <label className={styles.label}>Новый пароль</label>
          <input
            type="password"
            className={styles.input}
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Подтвердите пароль</label>
          <input
            type="password"
            className={styles.input}
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Сохранение..." : "Сохранить пароль"}
        </button>
      </div>
    </div>
  );
}
