"use client";

import { InventoryCreateInput } from "@/lib/validators/inventorySchema";
import { addInventory, loadInventory } from "@/services/inventoryService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Inventory } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";
import AddInventoryForm from "@/components/Form/InventoryForm/AddInventoryForm";
import PageContainer from "@/components/PageContainer/PageContainer";
import styles from "./page.module.css";

import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";

export default function AddInventoryPage() {
  const router = useRouter();
  const [existingItems, setExistingItems] = useState<Inventory[]>([]);

  useEffect(() => {
    loadInventory().then(setExistingItems);
  }, []);

  const breadcrumbItems = [
    { label: "Инвентарь", href: "/inventory" },
    { label: "Добавление инструмента" },
  ];

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
    <PageContainer>
      <div className={styles.header}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className={styles.headerWrapper}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Добавление инструмента</h1>
            <p className={styles.subtitle}>
              Заполните необходимые данные в форме ниже
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelBtn}
            >
              Отмена
            </button>
            <button
              type="submit"
              form="add-inventory-form" // Связка с ID формы
              className={styles.submitBtn}
            >
              Добавить инструмент
            </button>
          </div>
        </div>
      </div>
      <AddInventoryForm
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
      />
    </PageContainer>
  );
}
