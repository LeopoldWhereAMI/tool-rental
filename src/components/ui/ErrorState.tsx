import styles from "./States.module.css";

type ErrorStateProps = {
  error: string;
  onRetry: () => void;
};

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.errorState}>
      <p>Ошибка: {error}</p>
      <button onClick={onRetry}>Попробовать снова</button>
    </div>
  );
}
