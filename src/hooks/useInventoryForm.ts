import {
  InventoryFormValues,
  InventoryItemBase,
} from "@/components/Form/InventoryForm/inventoryFormTypes";
import { useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

export default function useInventoryForm(
  methods: UseFormReturn<InventoryFormValues>,
  existingItems: InventoryItemBase[],
  isEditMode: boolean,
  defaultId?: string,
) {
  const { setValue, setError, clearErrors, control } = methods;
  const selectedCategory = useWatch({ control, name: "category" });
  const watchedArticle = useWatch({ control, name: "article" });

  // Автогенерация артикула
  useEffect(() => {
    // if (isEditMode || !existingItems.length) return;
    if (isEditMode) return;

    if (selectedCategory) {
      const prefix = selectedCategory === "electric_tools" ? "Et-" : "Gt-";

      const categoryItems = existingItems.filter(
        (item) => item.category === selectedCategory,
      );

      const lastNumber = categoryItems.reduce((max, item) => {
        const match = item.article?.match(/\d+$/);
        const num = match ? parseInt(match[0], 10) : 0;
        return num > max ? num : max;
      }, 0);

      const nextNumber = (lastNumber + 1).toString().padStart(2, "0");

      setValue("article", `${prefix}${nextNumber}`, { shouldValidate: true });
    }
  }, [selectedCategory, existingItems, setValue, isEditMode]);

  // Валидация уникальности
  useEffect(() => {
    if (!watchedArticle || existingItems.length === 0) return;

    const isDuplicate = existingItems.some(
      (item) =>
        item.article?.toLowerCase() === watchedArticle.toLowerCase() &&
        item.id !== defaultId,
    );

    if (isDuplicate) {
      setError("article", {
        type: "manual",
        message: `Артикул "${watchedArticle}" уже занят другим инструментом`,
      });
    } else {
      clearErrors("article");
    }
  }, [watchedArticle, existingItems, setError, clearErrors, defaultId]);
}
