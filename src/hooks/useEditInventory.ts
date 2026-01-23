import { InventoryCreateInput } from "@/lib/validators/inventorySchema";
import { getInventoryItem } from "@/services/inventoryService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useEditInventory(id?: string) {
  const [defaultValues, setDefaultValues] =
    useState<InventoryCreateInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadItem = async () => {
      try {
        const item = await getInventoryItem(id);

        setDefaultValues({
          name: item.name,
          article: item.article,
          category: item.category,
          quantity: item.quantity,
          daily_price: item.daily_price,
          purchase_price: item.purchase_price,
          purchase_date: item.purchase_date
            ? new Date(item.purchase_date).toISOString().slice(0, 10)
            : null,
          notes: item.notes,
          serial_number: item.serial_number,
        });
      } catch (err) {
        console.error("Ошибка при загрузке инструмента:", err);
        setError("Не удалось загрузить инструмент");
        toast.error("Не удалось загрузить инструмент");
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  return { defaultValues, loading, error };
}
