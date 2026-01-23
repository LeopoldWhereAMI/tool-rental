import styles from "./SearchInput.module.css";

type SearchInputProps = {
  value: string;
  setSearch: (value: string) => void;
};

export default function SearchInput({ value, setSearch }: SearchInputProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Поиск"
        value={value}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
}
