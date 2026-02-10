import { useRouter } from "next/navigation";
import styles from "./BackButton.module.css";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  href?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

export default function BackButton({
  href,
  children = "Назад",
  onClick,
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    // Если передан внешний onClick (как мы сделали в ErrorBlock), вызываем его
    if (onClick) {
      onClick();
      return;
    }

    // Если есть конкретный href — идем по нему
    if (href) {
      router.push(href);
    } else {
      // Если ничего не передали — просто шаг назад по истории
      router.back();
    }
  };

  return (
    <button onClick={handleClick} className={styles.backButton} type="button">
      <ArrowLeft size={18} /> <span>{children}</span>
    </button>
  );
}
