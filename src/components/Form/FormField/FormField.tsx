import React, { ReactNode } from "react";
import styles from "./FormField.module.css";

type FormFieldProps = {
  label?: ReactNode;
  id: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export default function FormField({
  label,
  id,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={`${styles.inputField} ${className || ""}`}>
      <label htmlFor={id}>{label}</label>

      {children}
    </div>
  );
}
