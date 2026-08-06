"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Phone, Loader2 } from "lucide-react";
import { findCompanyByInn } from "@/services/dadata";
import { CreateClientInput } from "@/types";
import { OrderInput } from "@/lib/validators/orderSchema";
import { ClientTypeSelector } from "@/components/Form/ClientTypeSelector/ClientTypeSelector";
import formStyles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import { IndividualFields } from "@/components/Form/AddOrderForm/components/OrderClientSection/IndividualFields";
import { CompanyFields } from "@/components/Form/AddOrderForm/components/OrderClientSection/CompanyFields";
import { upsertPassport } from "@/services/passportService";
import styles from "./CreateClientModal.module.css";
import { ClientFormInput, clientSchema } from "@/lib/validators/clientSchema";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateClientInput) => Promise<{ id: string } | null>;
}

export default function CreateClientModal({
  isOpen,
  onClose,
  onSave,
}: CreateClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ClientFormInput>({
    resolver: zodResolver(clientSchema),
    mode: "onBlur",
    defaultValues: {
      client_type: "individual",
    },
  });

  const clientType = watch("client_type");
  const watchedInn = watch("inn");
  const isIndividual = clientType === "individual";

  useEffect(() => {
    setIsSwitching(true);
    const timer = setTimeout(() => setIsSwitching(false), 200);
    return () => clearTimeout(timer);
  }, [clientType]);

  // Автоматический поиск по ИНН (логика остается в родителе)
  useEffect(() => {
    if (clientType === "legal" && watchedInn?.length === 10) {
      const searchCompany = async () => {
        setIsSearching(true);
        try {
          const company = await findCompanyByInn(watchedInn);
          if (company) {
            setValue("company_name", company.value || "");
            setValue("kpp", company.data.kpp || "");
            setValue("ogrn", company.data.ogrn || "");
            setValue("legal_address", company.data.address.value || "");
          }
        } catch (error) {
          console.error("DaData error:", error);
        } finally {
          setIsSearching(false);
        }
      };
      searchCompany();
    }
  }, [watchedInn, clientType, setValue]);

  if (!isOpen) return null;

  const onSubmit = async (data: ClientFormInput) => {
    setLoading(true);

    let submitData: CreateClientInput;

    if (data.client_type === "individual") {
      submitData = {
        client_type: "individual",
        last_name: data.last_name,
        first_name: data.first_name,
        middle_name: data.middle_name,
        phone: data.phone,
      };
    } else {
      submitData = {
        client_type: "legal",
        phone: data.phone || "",
        company_name: data.company_name || "",
        inn: data.inn || "",
        kpp: data.kpp,
        ogrn: data.ogrn,
        legal_address: data.legal_address || "",
      };
    }

    // const success = await onSave(submitData as CreateClientInput);
    const client = await onSave(submitData);
    if (client && data.client_type === "individual") {
      await upsertPassport(client.id, {
        passport_series: data.passport_series,
        passport_number: data.passport_number,
        issued_by: data.issued_by,
        issue_date: data.issue_date,
        registration_address: data.registration_address,
      });
    }

    setLoading(false);

    if (client) {
      reset();
      onClose();
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Новый клиент</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={formStyles.form}>
          <ClientTypeSelector register={register} />

          <div className={formStyles.fieldGroup} style={{ marginTop: "16px" }}>
            <label className={formStyles.sectionTitle}>
              <Phone
                size={16}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
                className={styles.phoneIcon}
              />
              <span className={styles.sectionNumber}>1</span>
              Контактный телефон
            </label>
            <input
              {...register("phone", { required: "Телефон обязателен" })}
              className={`${formStyles.input} ${errors.phone ? formStyles.hasError : ""}`}
              placeholder="+7 (999) 000-00-00"
            />
            {errors.phone && (
              <span className={formStyles.errorText}>
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className={styles.fieldsScrollArea}>
            {isSwitching ? (
              <div className={styles.loaderContainer}>
                <Loader2 className={styles.spinner} size={32} />
                <p>Загрузка полей...</p>
              </div>
            ) : (
              <div className={styles.fadeIn}>
                {isIndividual ? (
                  <IndividualFields
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    control={control}
                  />
                ) : (
                  <CompanyFields
                    register={register}
                    errors={errors}
                    isSearching={isSearching}
                  />
                )}
              </div>
            )}
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || isSearching}
            >
              {loading ? "Сохранение..." : "Создать клиента"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
