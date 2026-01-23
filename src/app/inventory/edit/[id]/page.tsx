"use client";

import InventoryForm from "@/components/Form/InventoryForm/InventoryForm";
import BackButton from "@/components/BackButton/BackButton";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import useEditInventory from "@/hooks/useEditInventory";
import { InventoryCreateInput } from "@/lib/validators/inventorySchema";
import { updateInventory } from "@/services/inventoryService";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditInventoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { defaultValues, loading, error } = useEditInventory(id);

  const onSubmit = async (data: InventoryCreateInput) => {
    if (!id) return;

    try {
      await updateInventory(id, data);
      toast.success("Инструмент обновлён!");
      router.push(`/inventory/${id}`);
    } catch (err) {
      console.error("Ошибка при обновлении инструмента:", err);
      toast.error("Не удалось обновить инструмент");
    }
  };

  if (loading || !defaultValues) return <PageWrapper>Загрузка...</PageWrapper>;
  if (error || !defaultValues)
    return <PageWrapper>{error || "Ошибка"}</PageWrapper>;

  return (
    <div>
      <PageWrapper>
        <BackButton>Назад</BackButton>
        <InventoryForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          submitText="Сохранить изменения"
        />
      </PageWrapper>
    </div>
  );
}
