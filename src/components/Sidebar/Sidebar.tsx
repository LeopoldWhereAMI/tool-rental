import Navigation from "./Navigation/Navigation";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.aside}>
      <Navigation />
    </aside>
  );
}
