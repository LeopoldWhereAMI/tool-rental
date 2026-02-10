import { UseFormRegisterReturn } from "react-hook-form";
import styles from "./Form.module.css";

interface InputWithIconProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  icon?: React.ElementType;
  register: UseFormRegisterReturn;
  error?: boolean;
  isTextArea?: boolean;
  rows?: number;
  inputMode?: React.HTMLAttributes<HTMLElement>["inputMode"];
}

export default function InputWithIcon({
  icon: Icon,
  register,
  error,
  isTextArea,
  className,
  ...props
}: InputWithIconProps) {
  const Component = isTextArea ? "textarea" : "input";
  return (
    <div className={styles.inputWrapper}>
      <Component
        {...props}
        {...register}
        className={`${styles.input} ${Icon ? styles.inputWithIcon : ""} ${error ? styles.error : ""} ${className || ""}`}
      />
      {Icon && <Icon className={styles.inputIcon} size={16} />}
    </div>
  );
}
