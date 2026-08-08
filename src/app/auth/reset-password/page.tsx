import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import styles from "./page.module.css";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Загрузка...</h1>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
