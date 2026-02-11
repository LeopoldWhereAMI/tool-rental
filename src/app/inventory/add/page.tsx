"use client";

import PageWrapper from "@/components/PageWrapper/PageWrapper";
import { InventoryCreateInput } from "@/lib/validators/inventorySchema";
import { addInventory, loadInventory } from "@/services/inventoryService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import InventoryForm from "@/components/Form/InventoryForm/InventoryForm";
import BackButton from "@/components/BackButton/BackButton";
import { useEffect, useState } from "react";
import { Inventory } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";

export default function AddInventoryPage() {
  const router = useRouter();
  const [existingItems, setExistingItems] = useState<Inventory[]>([]);

  useEffect(() => {
    loadInventory().then(setExistingItems);
  }, []);

  const onSubmit = async (data: InventoryCreateInput) => {
    try {
      const result = await addInventory(data);

      if (result) {
        toast.success("Инструмент добавлен!");

        router.push("/inventory");
      }
    } catch (err: unknown) {
      const error = err as PostgrestError;
      if (error.code === "23505") {
        toast.error(`Артикул "${data.article}" уже занят!`);
      } else {
        toast.error("Ошибка при сохранении");
      }
    }
  };

  return (
    <PageWrapper>
      <BackButton href="/inventory" />
      <InventoryForm
        onSubmit={onSubmit}
        existingItems={existingItems}
        defaultValues={{
          name: "",
          article: "",
          category: "",
          daily_price: 500,
          purchase_price: null,
          purchase_date: null,
          notes: null,
          serial_number: null,
        }}
        submitText="Добавить инструмент"
      />
    </PageWrapper>
  );
}
