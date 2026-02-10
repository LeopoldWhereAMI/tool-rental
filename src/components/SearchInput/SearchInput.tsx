import { Search } from "lucide-react";
import styles from "./SearchInput.module.css";

type SearchInputProps = {
  value: string;
  setSearch: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  value,
  setSearch,
  placeholder = "Поиск",
}: SearchInputProps) {
  return (
    <div className={styles.searchWrapper}>
      <Search size={16} className={styles.searchIcon} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
}
