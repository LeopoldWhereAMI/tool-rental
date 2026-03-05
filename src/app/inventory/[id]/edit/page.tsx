"use client";

// import useEditInventory from "@/hooks/useEditInventory";
import { InventoryCreateInput } from "@/lib/validators/inventorySchema";
import { updateInventory } from "@/services/inventoryService";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ErrorBlock from "@/components/ui/ErrorBlock/ErrorBlock";
import InventoryFormSkeleton from "@/components/Form/InventoryForm/InventoryFormSkeleton";
import PageContainer from "@/components/PageContainer/PageContainer";
import styles from "./page.module.css";
import EditInventoryForm from "@/components/Form/InventoryForm/EditInventoryForm";
import { useMemo } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import ItemGallery from "@/components/Inventory/ItemGallery/ItemGallery";
import { useInventoryItem } from "@/hooks/useInventoryItem";

export default function EditInventoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  // const { defaultValues, loading, error } = useEditInventory(id);
  // const { item, mutate } = useInventoryItem(id);
  const { item, loading, error, mutate } = useInventoryItem(id);

  const defaultValues = useMemo(() => {
    if (!item) return null;

    return {
      name: item.name || "",
      article: item.article || "",
      category: item.category || "",
      daily_price: item.daily_price || 0,
      purchase_price: item.purchase_price || 0,
      purchase_date: item.purchase_date, // В useInventoryItem он уже форматируется в YYYY-MM-DD
      notes: item.notes || "",
      serial_number: item.serial_number || "",
      maintenance_interval_days: item.maintenance_interval_days || 30,
    } as InventoryCreateInput;
  }, [item]);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Инвентарь", href: "/inventory" },
      {
        label: defaultValues?.name || "Инструмент",
        href: `/inventory/${id}`,
      },
      { label: "Редактирование" },
    ],
    [defaultValues?.name, id],
  );

  const onSubmit = async (data: InventoryCreateInput) => {
    if (!id) return;
    try {
      await updateInventory(id, data);
      toast.success("Инструмент успешно обновлён");
      mutate();
      router.push(`/inventory/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при сохранении изменений");
    }
  };

  if (loading) return <InventoryFormSkeleton />;

  if (error || !defaultValues) {
    return (
      <PageContainer>
        <ErrorBlock
          title="Данные не найдены"
          message={error || "Не удалось загрузить информацию об инструменте"}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <header className={styles.header}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className={styles.headerWrapper}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Редактирование инструмента</h1>
            <p className={styles.subtitle}>
              Измените необходимые данные в форме ниже
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => router.back()}
            >
              Отмена
            </button>
            <button
              type="submit"
              form="edit-tool-form"
              className={styles.submitBtn}
            >
              Сохранить
            </button>
          </div>
        </div>
      </header>

      <div className={styles.contentBody}>
        <aside className={styles.leftColumn}>
          <ItemGallery id={id} imageUrl={item?.image_url} onMutate={mutate} />
        </aside>
        <main className={styles.rightColumn}>
          <EditInventoryForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
          />
        </main>
      </div>
    </PageContainer>
  );
}
