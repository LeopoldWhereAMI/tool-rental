import styles from "./page.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Карточка пользователя</h1>
        <span className={styles.subTitle}>
          Просмотр и управление данными аккаунта.
        </span>
      </div>
    </div>
  );
}
