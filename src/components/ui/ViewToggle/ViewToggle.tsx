import { LayoutGrid, TableIcon } from "lucide-react";
import styles from "./ViewToggle.module.css";
import { ViewMode } from "@/types";

type ViewToggleProps = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

export default function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className={styles.viewToggle}>
      <button
        onClick={() => setViewMode("table")}
        className={viewMode === "table" ? styles.activeToggle : ""}
      >
        <TableIcon size={18} />
      </button>
      <button
        onClick={() => setViewMode("cards")}
        className={viewMode === "cards" ? styles.activeToggle : ""}
      >
        <LayoutGrid size={18} />
      </button>
    </div>
  );
}
