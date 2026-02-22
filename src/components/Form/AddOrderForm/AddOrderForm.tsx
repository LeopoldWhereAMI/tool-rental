"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { CheckCircle, ChevronRight, Info, User, Wrench } from "lucide-react";
import Link from "next/link";

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
      security_deposit: undefined,
    },
  });

  // Автоматическая очистка ошибок при изменении полей
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

  const watchedItems = useWatch({ control, name: "items" });
  const securityDeposit = useWatch({ control, name: "security_deposit" });

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
    <>
      <div className={styles.noPrint}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className={styles.pageWrapper}>
            {/* Заголовок */}
            <div className={styles.pageHeader}>
              <nav className={styles.breadcrumb}>
                {/* Теперь "Заказы" — это кликабельная ссылка */}
                <Link href="/orders" className={styles.breadcrumbLink}>
                  Заказы
                </Link>

                <ChevronRight
                  size={14}
                  className={styles.breadcrumbSeparator}
                />

                <span className={styles.breadcrumbCurrent}>Новый заказ</span>
              </nav>
              <h1 className={styles.pageTitle}>Оформление нового заказа</h1>
              <p className={styles.pageSubtitle}>
                Зарегистрируйте новый договор аренды и выберите инструменты из
                склада.
              </p>
            </div>

            {/* Левая колонка */}
            <div className={styles.formColumn}>
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitle}>
                    <User size={20} className={styles.titleIcon} />
                    <span className={styles.sectionNumber}>1</span>
                    Информация о клиенте
                  </div>
                </div>
                <OrderClientSection
                  register={register}
                  errors={errors}
                  control={control}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  clients={clients}
                />
              </div>

              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitle}>
                    <Wrench size={20} className={styles.titleIcon} />
                    <span className={styles.sectionNumber}>4</span>
                    Выбор инструментов
                  </div>
                </div>
                <OrderItemsSection
                  control={control}
                  register={register}
                  errors={errors}
                  inventory={inventory}
                  totalAmount={totalAmount}
                />
              </div>
            </div>

            {/* Сайдбар */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <h2 className={styles.sidebarTitle}>
                  <CheckCircle size={18} />
                  Итого по заказу
                </h2>

                <div className={styles.divider} />

                <div className={styles.summaryRow}>
                  <span>Инструментов</span>
                  <span className={styles.summaryValue}>
                    {watchedItems?.filter((i) => i.inventory_id).length ?? 0}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Стоимость аренды</span>
                  <span className={styles.summaryValue}>
                    {totalAmount > 0 ? `${totalAmount} ₽` : ""}
                  </span>
                </div>

                {/* Обеспечительный платёж */}
                <div className={styles.depositField}>
                  <label
                    className={styles.depositLabel}
                    htmlFor="security_deposit"
                  >
                    Обеспечительный платёж
                    <span className={styles.depositOptional}>
                      необязательно
                    </span>
                  </label>
                  <div className={styles.depositInputWrapper}>
                    <input
                      {...register("security_deposit", {
                        setValueAs: (v) => (v === "" ? undefined : Number(v)),
                      })}
                      id="security_deposit"
                      type="number"
                      min="0"
                      step="100"
                      className={styles.depositInput}
                      placeholder="0"
                    />
                    <span className={styles.depositCurrency}>₽</span>
                  </div>
                </div>

                {/* Итоговая сумма с учётом депозита */}
                <div className={styles.totalRow}>
                  <div className={styles.totalLabel}>Итого к оплате</div>
                  <div className={styles.totalAmount}>
                    <div className={styles.totalAmountValue}>
                      {totalAmount > 0
                        ? `${totalAmount + (Number(securityDeposit) || 0)} ₽`
                        : ""}
                    </div>
                    {totalAmount > 0 && (
                      <div className={styles.totalAmountNote}>
                        {securityDeposit
                          ? `аренда + залог ${securityDeposit} ₽`
                          : "за весь период"}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || totalAmount <= 0}
                  className={styles.submitBtn}
                  style={{ marginTop: "20px" }}
                >
                  <CheckCircle size={18} />
                  {isSubmitting ? "Оформление..." : "Создать заказ"}
                </button>

                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => reset()}
                >
                  Отмена
                </button>

                <div className={styles.infoBox}>
                  <Info size={14} />
                  <p className={styles.infoBoxText}>
                    Обеспечительный платёж возвращается при возврате всех
                    арендованных инструментов в исходном состоянии.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {lastOrderForPrint && (
        <PrintArea data={lastOrderForPrint} printRef={printRef} />
      )}
    </>
  );
}
