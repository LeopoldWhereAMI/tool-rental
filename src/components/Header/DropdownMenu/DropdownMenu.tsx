import Link from "next/link";
import styles from "./DropdownMenu.module.css";
import { LogOut, User } from "lucide-react";

type DropdownMenuProps = {
  onClose: () => void;
  userId: string | undefined;
  handleLogout: () => Promise<void>;
  loading: boolean;
};

export default function DropdownMenu({
  onClose,
  userId,
  handleLogout,
  loading,
}: DropdownMenuProps) {
  return (
    <ul className={styles.dropdown}>
      <li className={styles.dropdownItem}>
        <Link
          href={`/profile/${userId}`}
          className={styles.profileLink}
          onClick={onClose}
        >
          <User size={16} />
          Профиль
        </Link>
      </li>
      <li className={styles.dropdownItem}>
        <button
          className={styles.dropdownItemLogout}
          onClick={handleLogout}
          disabled={loading}
        >
          <LogOut size={16} />
          {loading ? "Выход..." : "Выход"}
        </button>
      </li>
    </ul>
  );
}
