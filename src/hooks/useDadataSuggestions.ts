import { useState, useEffect, useRef } from "react";
import { UseFormSetValue, Path, PathValue, FieldValues } from "react-hook-form";

// Определяем базовый интерфейс подсказки, чтобы хук знал о существовании .value
interface BaseSuggestion {
  value: string;
}

interface UseDadataProps<
  TFieldValues extends FieldValues,
  TSearchRes extends BaseSuggestion,
> {
  searchValue: string | undefined;
  setValue: UseFormSetValue<TFieldValues>;
  fieldName: Path<TFieldValues>;
  suggestFn: (query: string) => Promise<TSearchRes[]>;
  minChars?: number;
  debounceMs?: number;
}

export function useDadataSuggestions<
  TFieldValues extends FieldValues,
  TSearchRes extends BaseSuggestion,
>({
  searchValue,
  setValue,
  fieldName,
  suggestFn,
  minChars = 3,
  debounceMs = 400,
}: UseDadataProps<TFieldValues, TSearchRes>) {
  const [suggestions, setSuggestions] = useState<TSearchRes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isSelectingRef = useRef(false);

  useEffect(() => {
    if (isSelectingRef.current) return;

    const timer = setTimeout(async () => {
      if (searchValue && searchValue.length >= minChars) {
        setIsLoading(true);
        try {
          const res = await suggestFn(searchValue);
          setSuggestions(res);
        } catch (error) {
          console.error("Dadata fetch error:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, suggestFn, minChars, debounceMs]);

  const handleSelect = (suggestionValue: string) => {
    isSelectingRef.current = true;

    // Используем PathValue для строгой типизации значения
    setValue(
      fieldName,
      suggestionValue as PathValue<TFieldValues, Path<TFieldValues>>,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    setSuggestions([]);

    setTimeout(() => {
      isSelectingRef.current = false;
    }, 500);
  };

  return { suggestions, isLoading, handleSelect };
}
