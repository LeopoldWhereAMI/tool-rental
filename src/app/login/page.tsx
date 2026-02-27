"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction, signUpAction } from "@/app/actions/auth";
import { toast } from "sonner";
import styles from "./page.module.css";
import { AlertCircle, CheckCircle } from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (emailValue: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailValue);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email обязателен";
    } else if (!validateEmail(email)) {
      newErrors.email = "Некорректный email";
    }

    if (!password) {
      newErrors.password = "Пароль обязателен";
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }

    if (isSignUp) {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Подтверждение пароля обязательно";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Пароли не совпадают";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await loginAction(email, password);

      if (result?.error) {
        setErrors({ form: result.error });
        toast.error(result.error);
        setLoading(false);
        return;
      }

      if (result?.success) {
        toast.success("Вы успешно вошли!");
        setSuccessMessage("Перенаправление...");
        setTimeout(() => {
          router.push("/");
        }, 300);
      }
    } catch (err) {
      const error = err as Error;
      const errorMsg = error.message || "Ошибка при входе";
      setErrors({ form: errorMsg });
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await signUpAction(email, password);

      if (result?.error) {
        setErrors({ form: result.error });
        toast.error(result.error);
        setLoading(false);
        return;
      }

      if (result?.success) {
        setSuccessMessage(
          result.message || "Регистрация успешна! Теперь войдите.",
        );
        toast.success("Регистрация успешна!");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsSignUp(false);
        setLoading(false);
      }
    } catch (err) {
      const error = err as Error;
      const errorMsg = error.message || "Ошибка при регистрации";
      setErrors({ form: errorMsg });
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{isSignUp ? "Регистрация" : "Вход"}</h1>
          <p className={styles.subtitle}>
            {isSignUp ? "Создайте новый аккаунт" : "Войдите в ваш аккаунт"}
          </p>
        </div>

        {successMessage && (
          <div className={styles.success}>
            <CheckCircle size={16} />
            {successMessage}
          </div>
        )}

        {errors.form && (
          <div className={styles.error} style={{ marginBottom: "20px" }}>
            <AlertCircle size={16} />
            {errors.form}
          </div>
        )}

        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              disabled={loading}
            />
            {errors.email && (
              <div className={styles.error}>
                <AlertCircle size={14} />
                {errors.email}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              disabled={loading}
            />
            {errors.password && (
              <div className={styles.error}>
                <AlertCircle size={14} />
                {errors.password}
              </div>
            )}
          </div>

          {isSignUp && (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="confirmPassword">
                Подтвердите пароль
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: "" });
                }}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <div className={styles.error}>
                  <AlertCircle size={14} />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={loading}
            >
              {loading
                ? "Загрузка..."
                : isSignUp
                  ? "Зарегистрироваться"
                  : "Войти"}
            </button>
          </div>
        </form>

        <div className={styles.toggleText}>
          {isSignUp ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
          <button
            className={styles.toggleButton}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              setErrors({});
              setSuccessMessage("");
            }}
            disabled={loading}
          >
            {isSignUp ? "Войти" : "Зарегистрироваться"}
          </button>
        </div>
      </div>
    </div>
  );
}
