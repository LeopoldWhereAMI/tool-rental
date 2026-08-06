"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import styles from "./page.module.css";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    if (!token) {
      setInvalidToken(true);
      setCheckingToken(false);
      return;
    }

    fetch(`/api/auth/check-reset-token?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setInvalidToken(true);
        }
      })
      .catch(() => {
        setInvalidToken(true);
      })
      .finally(() => {
        setCheckingToken(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Ссылка восстановления недействительна");
      return;
    }

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
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Пароль успешно изменён");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ошибка изменения пароля",
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Проверка ссылки...</h1>
        </div>
      </div>
    );
  }

  if (invalidToken) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Ссылка недействительна</h1>

          <p className={styles.subtitle}>
            Возможно, срок действия ссылки истёк. Запросите восстановление
            пароля снова.
          </p>

          <button
            className={styles.button}
            onClick={() => router.push("/login")}
          >
            Вернуться ко входу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Новый пароль</h1>

        <p className={styles.subtitle}>
          Введите новый пароль для вашего аккаунта
        </p>

        <form onSubmit={handleSubmit}>
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
            <label className={styles.label}>Повторите пароль</label>

            <input
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить пароль"}
          </button>
        </form>
      </div>
    </div>
  );
}
