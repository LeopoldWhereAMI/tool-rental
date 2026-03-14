import { OrderInput } from "@/lib/validators/orderSchema";
import { Client } from "@/types";
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { AlertOctagon, Phone } from "lucide-react";
import styles from "@/components/Form/AddOrderForm/AddOrderForm.module.css";
import useFindClient from "./useFindClient";
import usePickClient from "./usePickClient";
import { ClientTypeSelector } from "@/components/Form/ClientTypeSelector/ClientTypeSelector";
import { useEffect, useState } from "react";
import { findCompanyByInn } from "@/services/dadata";
import Spinner from "@/components/ui/Spinner/Spinner";
import { IndividualFields } from "./IndividualFields";
import { CompanyFields } from "./CompanyFields";
import { FoundClientBtn } from "./FoundClientBtn";
import { toast } from "sonner";

type OrderClientSectionProps = {
  register: UseFormRegister<OrderInput>;
  errors: FieldErrors<OrderInput>;
  control: Control<OrderInput>;
  setValue: UseFormSetValue<OrderInput>;
  clearErrors: UseFormClearErrors<OrderInput>;
  clients: Client[];
};

export default function OrderClientSection({
  register,
  errors,
  control,
  setValue,
  clearErrors,
  clients,
}: OrderClientSectionProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const watchedPhone = useWatch({ control, name: "phone" });
  const watchedClientType = useWatch({ control, name: "client_type" });
  const watchedInn = useWatch({ control, name: "inn" });

  const isIndividual = watchedClientType === "individual";

  const resetIndividualFields = () => {
    setValue("last_name", "");
    setValue("first_name", "");
    setValue("middle_name", "");
    setValue("passport_series", "");
    setValue("passport_number", "");
    setValue("issue_date", "");
    setValue("issued_by", "");
    setValue("registration_address", "");

    clearErrors([
      "last_name",
      "first_name",
      "middle_name",
      "passport_series",
      "passport_number",
      "issue_date",
      "issued_by",
      "registration_address",
    ]);
  };

  const resetCompanyFields = () => {
    setValue("company_name", "");
    setValue("inn", "");
    setValue("kpp", "");
    setValue("ogrn", "");
    setValue("legal_address", "");

    clearErrors(["company_name", "inn", "kpp", "ogrn", "legal_address"]);
  };

  useEffect(() => {
    setIsSwitching(true);

    if (watchedClientType === "individual") {
      resetCompanyFields();
    } else {
      resetIndividualFields();
    }

    const timer = setTimeout(() => {
      setIsSwitching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [watchedClientType]);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      const cleanInn = (watchedInn || "").trim();

      if (!cleanInn || cleanInn.length !== 10) {
        setValue("company_name", "");
        setValue("ogrn", "");
        setValue("legal_address", "");
        setValue("kpp", "");
        return;
      }

      setIsSearching(true);

      try {
        const company = await findCompanyByInn(cleanInn);

        if (company) {
          setValue("company_name", company.value);
          setValue("ogrn", company.data.ogrn);
          setValue("legal_address", company.data.address.value);
          setValue("kpp", company.data.kpp || "");
          clearErrors(["company_name", "ogrn", "legal_address"]);
        } else {
          resetCompanyFields();
        }
      } catch (error) {
        console.error(error);
        toast.error("Не удалось найти компанию по ИНН");
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [watchedInn]);

  const { foundClients, isExactMatch, normalizePhone } = useFindClient(
    watchedPhone,
    clients,
    watchedClientType,
  );

  const { applyFoundClient, isSelectionActive } = usePickClient(
    watchedPhone ?? "",
    setValue,
    clearErrors,
  );

  return (
    <>
      <ClientTypeSelector register={register} />

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="phone">
          Номер телефона
        </label>
        <div className={styles.inputWithIcon}>
          <Phone size={16} />
          <input
            {...register("phone")}
            id="phone"
            type="tel"
            inputMode="tel"
            className={`${styles.input} ${errors.phone ? styles.hasError : ""}`}
            placeholder="+7 (999) 000-00-00"
          />
        </div>
        {errors.phone && (
          <span className={styles.errorText}>{errors.phone.message}</span>
        )}

        {/* Найденные клиенты */}
        <div className={styles.phoneStatus}>
          {!isSelectionActive && foundClients.length > 0 ? (
            <div className={styles.foundList}>
              <div className={styles.foundListHeader}>Найдено в базе:</div>

              {foundClients.map((client) => {
                return (
                  <FoundClientBtn
                    key={client.id}
                    client={client}
                    watchedPhone={watchedPhone ?? ""}
                    onSelect={applyFoundClient}
                    normalizePhone={normalizePhone}
                  />
                );
              })}
            </div>
          ) : (watchedPhone || "").length > 10 && !isExactMatch ? (
            <span className={styles.newBadge}>
              {isIndividual
                ? "Новый клиент — будет создан автоматически"
                : "Новая компания — будет создана автоматически"}
            </span>
          ) : null}
          {isExactMatch &&
            foundClients.find(
              (c) =>
                normalizePhone(c.phone ?? "") ===
                  normalizePhone(watchedPhone ?? "") && c.is_blacklisted,
            ) && (
              <div className={styles.warningBanner}>
                <AlertOctagon size={18} />
                <span>Внимание! Этот клиент находится в чёрном списке.</span>
              </div>
            )}
        </div>
      </div>
      <div
        className={styles.fieldsContainer}
        style={{ minHeight: "300px", position: "relative" }}
      >
        {isSwitching ? (
          <div className={styles.switchLoader}>
            <Spinner size={40} />
            <p>Загрузка формы...</p>
          </div>
        ) : (
          <>
            {isIndividual ? (
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
          </>
        )}
      </div>
    </>
  );
}
