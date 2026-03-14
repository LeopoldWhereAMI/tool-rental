"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { getClientById, updateClient } from "@/services/clientsService";
import styles from "./page.module.css";
import { toast } from "sonner";
import { User, Save, Info, Building } from "lucide-react";
import PageContainer from "@/components/PageContainer/PageContainer";
import Breadcrumbs from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { OrderInput } from "@/lib/validators/orderSchema";
import { CompanyFields } from "@/components/Form/AddOrderForm/components/OrderClientSection/CompanyFields";
import { IndividualFields } from "@/components/Form/AddOrderForm/components/OrderClientSection/IndividualFields";

export default function EditClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSearching] = useState(false); // Для ИНН/названия компании

  // Инициализируем react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control, // <-- Должно быть здесь
    setValue,
    formState: { errors },
  } = useForm<OrderInput>({
    defaultValues: {
      client_type: "individual", // По умолчанию физлицо
    },
  });

  // Наблюдаем за типом клиента, чтобы понимать, какие поля рендерить
  const clientType = watch("client_type");

  // Получаем имя и фамилию для хлебных крошек
  const watchFirstName = watch("first_name");
  const watchLastName = watch("last_name");
  const watchCompanyName = watch("company_name");

  const breadcrumbItems = useMemo(
    () => [
      { label: "Клиенты", href: "/clients" },
      {
        label:
          clientType === "individual"
            ? `${watchLastName || ""} ${watchFirstName || ""}`.trim() ||
              "Клиент"
            : watchCompanyName || "Компания",
        href: `/clients/${id}`,
      },
      { label: "Редактировать профиль" },
    ],
    [watchFirstName, watchLastName, watchCompanyName, clientType, id],
  );

  useEffect(() => {
    if (id) {
      getClientById(id as string)
        .then((data) => {
          reset({
            client_type: data.client_type || "individual",
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            middle_name: data.middle_name || "",
            phone: data.phone || "",
            // Для юрлиц
            company_name: data.company_name || "",
            inn: data.inn || "",
            kpp: data.kpp || "",
            ogrn: data.ogrn || "",
            legal_address: data.legal_address || "",
            // Для физлиц
            passport_series: data.passport_series || "",
            passport_number: data.passport_number || "",
            issue_date: data.issue_date || "",
            issued_by: data.issued_by || "",
            registration_address: data.registration_address || "",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, reset]);

  // onSubmit теперь типизирован через react-hook-form
  const onSubmit: SubmitHandler<OrderInput> = async (data) => {
    setSaving(true);
    try {
      await updateClient(id as string, data);
      toast.success("Данные клиента обновлены");
      router.push(`/clients/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Не удалось обновить данные");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.pageWrapper}>Загрузка...</div>;

  return (
    <PageContainer>
      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className={styles.pageTitle}>Редактирование профиля</h1>
          <p className={styles.pageSubtitle}>
            Измените личные данные и контактную информацию клиента
          </p>
        </header>

        <div className={styles.mainContent}>
          <main className={styles.formColumn}>
            <form id="edit-client-form" onSubmit={handleSubmit(onSubmit)}>
              <section className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    {clientType === "individual" ? (
                      <User size={18} />
                    ) : (
                      <Building size={18} />
                    )}
                    Данные клиента
                  </h2>
                </div>

                {/* Общее поле для обоих типов */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Номер телефона</label>
                  <input
                    className={`${styles.input} ${errors.phone ? styles.hasError : ""}`}
                    type="tel"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <span className={styles.errorText}>
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                {/* Условный рендеринг ваших компонентов */}
                {clientType === "individual" ? (
                  <IndividualFields
                    register={register}
                    errors={errors}
                    control={control}
                    setValue={setValue}
                  />
                ) : (
                  <CompanyFields
                    register={register}
                    errors={errors}
                    isSearching={isSearching}
                  />
                )}
              </section>
            </form>
          </main>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Действия</h3>
              <button
                type="submit"
                form="edit-client-form"
                className={styles.submitBtn}
                disabled={saving}
              >
                <Save size={18} />{" "}
                {saving ? "Сохранение..." : "Сохранить изменения"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className={styles.cancelBtn}
              >
                Отмена
              </button>
              <div className={styles.infoBox}>
                <Info size={16} />
                <div className={styles.infoBoxText}>
                  Все изменения будут сохранены.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}
