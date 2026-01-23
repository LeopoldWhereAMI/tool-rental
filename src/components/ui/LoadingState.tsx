import styles from "./States.module.css";

export default function LoadingState() {
  return (
    <div className={styles.loadingState}>
      <p>Загрузка инвентаря...</p>
    </div>
  );
}
