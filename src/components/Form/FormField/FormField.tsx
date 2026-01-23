import React from "react";
import styles from "./FormField.module.css";

type FormFieldProps = {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export default function FormField({
  label,
  id,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    // <div className={styles.inputField}>
    <div className={`${styles.inputField} ${className || ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
