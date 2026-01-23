"use client";

import PageWrapper from "@/components/PageWrapper/PageWrapper";
import { InventoryCreateInput } from "@/lib/validators/inventorySchema";
import { addInventory } from "@/services/inventoryService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import InventoryForm from "@/components/Form/InventoryForm/InventoryForm";
import BackButton from "@/components/BackButton/BackButton";

export default function AddInventoryPage() {
  const router = useRouter();

  const onSubmit = async (data: InventoryCreateInput) => {
    try {
      const result = await addInventory(data);

      if (result) {
        toast.success("Инструмент добавлен!");
        router.push("/inventory");
      }
    } catch (err) {
      toast.error("Ошибка при добавлении инструмента");
      console.error("Ошибка при добавлении инструмента:", err);
    }
  };

  return (
    <>
      <PageWrapper>
        <BackButton>Назад</BackButton>
        <InventoryForm
          onSubmit={onSubmit}
          defaultValues={{
            name: "",
            article: "",
            category: "",
            quantity: 1,
            daily_price: 500,
            purchase_price: null,
            purchase_date: null,
            notes: null,
            serial_number: null,
          }}
          submitText="Добавить инструмент"
        />
      </PageWrapper>
    </>
  );
}
