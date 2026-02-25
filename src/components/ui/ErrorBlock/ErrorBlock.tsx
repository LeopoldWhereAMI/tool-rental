"use client";

import { AlertCircle } from "lucide-react";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import styles from "./ErrorBlock.module.css";

type ErrorBlockProps = {
  title?: string;
  message?: string;
};

export default function ErrorBlock({
  title = "Произошла ошибка",
  message = "Не удалось загрузить данные. Пожалуйста, попробуйте позже.",
}: ErrorBlockProps) {
  return (
    <PageWrapper>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <AlertCircle size={48} />
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
      </div>
    </PageWrapper>
  );
}
