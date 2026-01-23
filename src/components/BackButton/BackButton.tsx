import { useRouter } from "next/navigation";
import styles from "./BackButton.module.css";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  fallback?: string;
  children?: React.ReactNode;
};

export default function BackButton({
  fallback = "/",
  children,
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button onClick={handleClick} className={styles.backButton}>
      <ArrowLeft size={18} /> {children}
    </button>
  );
}
