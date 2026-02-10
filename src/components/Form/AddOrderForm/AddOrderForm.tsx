"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { OrderInput, orderSchema } from "@/lib/validators/orderSchema";
import { upsertClient } from "@/services/clientsService";
import { createOrder } from "@/services/orderService";
import { OrderPrintBundle } from "@/types";
import styles from "./AddOrderForm.module.css";
import PrintArea from "@/components/Print/PrintArea/PrintArea";
import { useInventoryAndClients } from "@/hooks/useInventoryAndClients";
import { usePrintAfterSubmit } from "@/hooks/usePrintAfterSubmit";
import { calcOrderTotalFromItems } from "@/helpers";
import OrderItemsSection from "@/components/Form/AddOrderForm/components/OrderItemsSection/OrderItemsSection";

import {
  mapOrderToPrintBundle,
  prepareOrderPayload,
} from "@/lib/mappers/orderMapper";
import OrderClientSection from "./components/OrderClientSection/OrderClientSection";

export default function AddOrderForm() {
  const { inventory, inventoryMap, clients } = useInventoryAndClients();

  const [lastOrderForPrint, setLastOrderForPrint] =
    useState<OrderPrintBundle | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    mode: "onTouched",
    defaultValues: {
      items: [
        {
          inventory_id: "",
          start_date: new Date().toISOString().split("T")[0],
          end_date: "",
        },
      ],
    },
  });

  // Эффект для автоматической очистки ошибок при изменении
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && errors[name as keyof OrderInput]) {
        clearErrors(name as keyof OrderInput);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, errors, clearErrors]);

  const printRef = useRef<HTMLDivElement>(null);
  usePrintAfterSubmit(lastOrderForPrint, printRef, () =>
    setLastOrderForPrint(null),
  );

  const watchedItems = useWatch({
    control,
    name: "items",
  });

  // НОВЫЙ расчет суммы для всех инструментов в списке
  const totalAmount = useMemo(() => {
    return calcOrderTotalFromItems(watchedItems, inventoryMap);
  }, [watchedItems, inventoryMap]);

  const handleFormSubmit = async (data: OrderInput) => {
    try {
      const client = await upsertClient(data);

      const orderPayload = prepareOrderPayload(client.id, data, inventoryMap);

      const savedOrder = await createOrder(orderPayload);

      const printData = mapOrderToPrintBundle(
        data,
        inventoryMap,
        savedOrder,
        orderPayload.total_price,
      );

      setLastOrderForPrint(printData);
      toast.success("Заказ успешно создан!");
      reset();
    } catch (err) {
      console.error("Ошибка оформления:", err);
      toast.error(
        err instanceof Error ? err.message : "Не удалось сохранить заказ",
      );
    }
  };

  return (
    <div className={lastOrderForPrint ? styles.hideMainContent : ""}>
      <div className={styles.noPrint}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className={styles.addOrderForm}
        >
          <h1 className={styles.orderFormTitle}>Оформление нового заказа</h1>

          {/* СЕКЦИЯ: КЛИЕНТ */}
          <OrderClientSection
            register={register}
            errors={errors}
            control={control}
            setValue={setValue}
            clearErrors={clearErrors}
            clients={clients}
          />

          <OrderItemsSection
            control={control}
            register={register}
            errors={errors}
            inventory={inventory}
            totalAmount={totalAmount}
          />
          <button
            type="submit"
            disabled={isSubmitting || totalAmount <= 0}
            className={styles.btn}
          >
            {isSubmitting
              ? "Оформление заказа..."
              : `Сформировать договор на ${totalAmount || 0} ₽`}
          </button>
        </form>
      </div>

      {lastOrderForPrint && (
        <PrintArea data={lastOrderForPrint} printRef={printRef} />
      )}
    </div>
  );
}
