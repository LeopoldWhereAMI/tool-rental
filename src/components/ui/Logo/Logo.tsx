import styles from "./Logo.module.css";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.logo} ${className}`}>
      <div className={styles.brandIcon}>🛠️</div>
      <span className={styles.brandName}>
        RENT<strong>App</strong>
      </span>
    </div>
  );
}
