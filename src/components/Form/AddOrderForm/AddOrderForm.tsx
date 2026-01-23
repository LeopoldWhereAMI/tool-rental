"use client";

import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { OrderInput, orderSchema } from "@/lib/validators/orderSchema";
import { createClientInSupabase } from "@/services/clientsService";
import { loadInventory } from "@/services/inventoryService";
import { calculateOrderTotal, createOrder } from "@/services/orderService";
import { Client, Inventory, OrderPrintData } from "@/types";
import styles from "./AddOrderForm.module.css";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import FormField from "../FormField/FormField";
import RentalContract from "@/components/Print/RentalContract";
import { useRouter } from "next/navigation";

export default function AddOrderForm() {
  const router = useRouter();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [lastOrderForPrint, setLastOrderForPrint] = useState<{
    client: Client;
    inventory: Inventory;
    order: OrderPrintData;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    mode: "onTouched",
    defaultValues: {
      start_date: new Date().toISOString().split("T")[0],
      inventory_id: "",
    },
  });

  // Загрузка данных
  const refreshData = async () => {
    try {
      const inventoryData = await loadInventory();
      setInventory(inventoryData.filter((i) => i.status === "available"));
    } catch (err) {
      toast.error("Ошибка обновления данных");
      console.error("Ошибка обновления данных", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Наблюдение за полями
  const watchedInventoryId = watch("inventory_id");
  const watchedStartDate = watch("start_date");
  const watchedEndDate = watch("end_date");

  // Оптимизированный поиск инструмента
  const selectedTool = useMemo(
    () => inventory.find((item) => item.id === watchedInventoryId),
    [inventory, watchedInventoryId],
  );

  // Оптимизированный расчет суммы
  const totalAmount = useMemo(() => {
    if (selectedTool && watchedStartDate && watchedEndDate) {
      return calculateOrderTotal(
        watchedStartDate,
        watchedEndDate,
        selectedTool.daily_price,
      );
    }
    return 0;
  }, [selectedTool, watchedStartDate, watchedEndDate]);

  const handleFormSubmit = async (data: OrderInput) => {
    if (!selectedTool) {
      toast.error("Инструмент не выбран");
      return;
    }

    try {
      // 1. Создаем клиента (так как селекта нет, данные всегда из инпутов)
      const newClient = await createClientInSupabase({
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        phone: data.phone,
      });

      if (!newClient) throw new Error("Ошибка создания клиента");

      // Данные для печатной формы
      const clientForPrint = { ...newClient, ...data } as Client;

      // 2. Формируем заказ
      const orderPayload = {
        client_id: newClient.id, // ID только что созданного клиента
        inventory_id: data.inventory_id,
        start_date: data.start_date,
        end_date: data.end_date,
        total_price: totalAmount,
      };

      console.log("Данные для отправки:", orderPayload);
      const savedOrder = await createOrder(orderPayload);

      // 3. Подготовка к печати
      const printData: OrderPrintData = {
        ...data,
        total_price: totalAmount,
        order_number: savedOrder.order_number,
      };

      setLastOrderForPrint({
        client: clientForPrint,
        inventory: selectedTool,
        order: printData,
      });

      toast.success("Заказ успешно оформлен!");
      reset();

      // 4. Печать и переход на страницу списка/заказа
      setTimeout(() => {
        window.print();
        setLastOrderForPrint(null);

        // Перенаправляем на страницу со всеми заказами, чтобы увидеть результат
        if (savedOrder) {
          router.push("/orders");
        }
      }, 500);
    } catch (err) {
      console.error("Ошибка:", err);
      toast.error("Не удалось сохранить данные");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={styles.addOrderForm}
      >
        <h1 className={styles.orderFormTitle}>Создание заказа.</h1>

        <PageWrapper>
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Информация о клиенте</h2>

            {/* <h3>ФИО</h3> */}
            <div className={styles.nameInfo}>
              <FormField
                label="Фамилия"
                id="last_name"
                error={errors.last_name?.message}
                className={styles.flexItem}
              >
                <input
                  {...register("last_name")}
                  id="last_name"
                  type="text"
                  className={styles.input}
                />
              </FormField>

              <FormField
                label="Имя"
                id="first_name"
                error={errors.first_name?.message}
                className={styles.flexItem}
              >
                <input
                  {...register("first_name")}
                  id="first_name"
                  type="text"
                  className={styles.input}
                />
              </FormField>

              <FormField
                label="Отчество"
                id="middle_name"
                error={errors.middle_name?.message}
                className={styles.flexItem}
              >
                <input
                  {...register("middle_name")}
                  id="middle_name"
                  type="text"
                  className={styles.input}
                />
              </FormField>

              <FormField
                label="Телефон"
                id="phone"
                error={errors.phone?.message}
              >
                <input
                  {...register("phone")}
                  id="phone"
                  type="text"
                  inputMode="numeric"
                  placeholder="+7..."
                  maxLength={12}
                  className={styles.input}
                />
              </FormField>
            </div>
          </section>
        </PageWrapper>

        {/* Паспортные данные */}
        <PageWrapper>
          <h2 className={styles.sectionTitle}>Паспортные данные</h2>
          <div className={styles.pasportInfo}>
            <FormField
              label="Серия"
              id="passport_series"
              error={errors.passport_series?.message}
              className={styles.flexItem}
            >
              <input
                {...register("passport_series")}
                id="passport_series"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                className={styles.input}
              />
            </FormField>

            <FormField
              label="Номер"
              id="passport_number"
              error={errors.passport_number?.message}
              className={styles.flexItem}
            >
              <input
                {...register("passport_number")}
                id="passport_number"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className={styles.input}
              />
            </FormField>

            <FormField
              label="Дата выдачи"
              id="issue_date"
              error={errors.issue_date?.message}
              className={styles.flexItem}
            >
              <input
                {...register("issue_date")}
                id="issue_date"
                type="date"
                className={styles.input}
              />
            </FormField>

            <FormField
              label="Кем выдан"
              id="issued_by"
              error={errors.issued_by?.message}
            >
              <input
                {...register("issued_by")}
                id="issued_by"
                type="text"
                className={styles.input}
              />
            </FormField>
          </div>

          <FormField
            label="Адрес регистрации"
            id="registration_address"
            error={errors.registration_address?.message}
          >
            <input
              {...register("registration_address")}
              id="registration_address"
              type="text"
              className={styles.input}
            />
          </FormField>
        </PageWrapper>

        <PageWrapper>
          <section className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Инвентарь</h3>
            <FormField
              id="inventory_id"
              label="Инструмент в наличии"
              error={errors.inventory_id?.message}
            >
              <select
                {...register("inventory_id")}
                className={styles.addClientSelect}
              >
                <option value="">-- Выбрать инструмент --</option>
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} | {item.daily_price} руб/сут
                  </option>
                ))}
              </select>
            </FormField>
          </section>
        </PageWrapper>

        <PageWrapper>
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Период аренды</h2>
            <div className={styles.dateInputs}>
              <FormField
                id="start_date"
                label="Дата начала"
                error={errors.start_date?.message}
                className={styles.flexItem}
              >
                <input
                  type="date"
                  {...register("start_date")}
                  className={styles.input}
                />
              </FormField>
              <FormField
                id="end_date"
                label="Дата возврата"
                error={errors.end_date?.message}
                className={styles.flexItem}
              >
                <input
                  type="date"
                  {...register("end_date")}
                  className={styles.input}
                />
              </FormField>
            </div>

            {totalAmount > 0 && (
              <div
                className={
                  totalAmount > 0
                    ? styles.totalAmountBlock
                    : styles.totalAmountError
                }
              >
                <span>Итого к оплате: </span>
                <strong>{totalAmount} руб.</strong>
              </div>
            )}
          </section>
        </PageWrapper>

        <button
          type="submit"
          disabled={isSubmitting || totalAmount <= 0}
          className={styles.btn}
        >
          {isSubmitting
            ? "Оформление..."
            : `Создать договор (${totalAmount} руб.)`}
        </button>
      </form>

      {lastOrderForPrint && (
        <div className={styles.printWrapper} aria-hidden={!lastOrderForPrint}>
          <RentalContract
            client={lastOrderForPrint.client}
            inventory={lastOrderForPrint.inventory}
            orderData={{
              ...lastOrderForPrint.order,
              total_price: lastOrderForPrint.order.total_price,
            }}
          />
        </div>
      )}
    </div>
  );
}
