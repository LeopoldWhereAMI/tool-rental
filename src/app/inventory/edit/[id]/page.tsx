"use client";

import InventoryForm from "@/components/Form/InventoryForm/InventoryForm";
import BackButton from "@/components/BackButton/BackButton";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import useEditInventory from "@/hooks/useEditInventory";
import { InventoryCreateInput } from "@/lib/validators/inventorySchema";
import { updateInventory } from "@/services/inventoryService";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import InventoryFormSkeleton from "@/components/Form/InventoryForm/InventoryFormSkeleton";

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

  if (loading) return <InventoryFormSkeleton />;
  if (error || !defaultValues) {
    return (
      <ErrorBlock
        title="Не удалось загрузить данные"
        message={error || "Инструмент не найден"}
      />
    );
  }

  return (
    <div>
      <PageWrapper>
        <BackButton href={`/inventory/${id}`}>Назад к инструменту</BackButton>
        <InventoryForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          submitText="Сохранить изменения"
        />
      </PageWrapper>
    </div>
  );
}
