// import { Loader2 } from "lucide-react";
// import styles from "./SuggestionField.module.css";

// interface SuggestionFieldProps<T> {
//   label?: string;
//   isLoading?: boolean;
//   suggestions: T[];
//   renderInput: () => React.ReactNode;
//   onSelect: (item: T) => void;
//   getLabel: (item: T) => string;
// }

// export function SuggestionField<T>({
//   label,
//   isLoading,
//   suggestions,
//   renderInput,
//   onSelect,
//   getLabel,
// }: SuggestionFieldProps<T>) {
//   return (
//     <div className={styles.fieldGroup} style={{ position: "relative" }}>
//       <label className={styles.label}>{label}</label>
//       <div className={styles.inputWrapper}>
//         {renderInput()}
//         {isLoading && <Loader2 className={styles.innerSpinner} size={16} />}
//       </div>
//       {suggestions.length > 0 && (
//         <ul className={styles.suggestionList}>
//           {suggestions.map((s, i) => (
//             <li key={i} onClick={() => onSelect(s)}>
//               {getLabel(s)}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import styles from "./SuggestionField.module.css";

interface SuggestionFieldProps<T> {
  label?: string;
  isLoading?: boolean;
  suggestions: T[];
  renderInput: () => React.ReactNode;
  onSelect: (item: T) => void;
  getLabel: (item: T) => string;
}

export function SuggestionField<T>({
  label,
  isLoading,
  suggestions,
  renderInput,
  onSelect,
  getLabel,
}: SuggestionFieldProps<T>) {
  // Нам нужно знать только одно: "ушел" ли пользователь из компонента
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Вычисляем видимость прямо во время рендера (без useEffect)
  // Список виден только если есть фокус И есть данные
  const shouldShowSuggestions = isFocused && suggestions.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: T) => {
    onSelect(item);
    setIsFocused(false); // Скрываем после выбора
  };

  return (
    <div
      className={styles.fieldGroup}
      style={{ position: "relative" }}
      ref={containerRef}
      onFocus={() => setIsFocused(true)} // Фокус внутри любого элемента контейнера
    >
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {renderInput()}
        {isLoading && <Loader2 className={styles.innerSpinner} size={16} />}
      </div>

      {/* Используем вычисленное значение */}
      {shouldShowSuggestions && (
        <ul className={styles.suggestionList}>
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => handleSelect(s)}>
              {getLabel(s)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
