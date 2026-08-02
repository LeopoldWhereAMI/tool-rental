import { useState } from "react";
import { UseFormSetValue, UseFormClearErrors } from "react-hook-form";
import { OrderInput } from "@/lib/validators/orderSchema";
import { Client } from "@/types";
import { toast } from "sonner";
import { getClientDisplayName } from "@/helpers/clientUtils";
import { getPassport } from "@/services/passportService";

export default function usePickClient(
  watchedPhone: string | undefined,
  setValue: UseFormSetValue<OrderInput>,
  clearErrors: UseFormClearErrors<OrderInput>,
) {
  const [pickedPhone, setPickedPhone] = useState<string | undefined>();

  const isSelectionActive =
    pickedPhone !== undefined && watchedPhone === pickedPhone;

  const applyFoundClient = async (client: Client) => {
    const opts = { shouldValidate: true, shouldDirty: true, shouldTouch: true };
    const phoneValue = client.phone ?? "";
    const displayName = getClientDisplayName(client);

    // 1. Устанавливаем общие поля
    setValue("client_type", client.client_type, opts);
    setValue("phone", phoneValue, opts);

    // 2. Распределяем данные в зависимости от типа
    if (client.client_type === "individual") {
      setValue("last_name", client.last_name || "", opts);
      setValue("first_name", client.first_name || "", opts);
      setValue("middle_name", client.middle_name || "", opts);

      if (client.client_type === "individual") {
        setValue("last_name", client.last_name || "", opts);
        setValue("first_name", client.first_name || "", opts);
        setValue("middle_name", client.middle_name || "", opts);

        const passport = await getPassport(client.id);

        if (passport) {
          setValue("passport_series", passport.passport_series || "", opts);
          setValue("passport_number", passport.passport_number || "", opts);
          setValue("issued_by", passport.issued_by || "", opts);
          setValue("issue_date", passport.issue_date || "", opts);
          setValue(
            "registration_address",
            passport.registration_address || "",
            opts,
          );
        } else {
          setValue("passport_series", "", opts);
          setValue("passport_number", "", opts);
          setValue("issued_by", "", opts);
          setValue("issue_date", "", opts);
          setValue("registration_address", "", opts);
        }

        setValue("company_name", "", opts);
        setValue("inn", "", opts);
      }

      // Сбрасываем поля юрлица, если они были заполнены
      setValue("company_name", "", opts);
      setValue("inn", "", opts);
    } else {
      setValue("company_name", client.company_name || "", opts);
      setValue("inn", client.inn || "", opts);
      setValue("kpp", client.kpp || "", opts);
      setValue("ogrn", client.ogrn || "", opts);
      setValue("legal_address", client.legal_address || "", opts);

      // Бэкенд может не требовать ФИО для юрлиц, но форма может иметь эти поля.
      // Обычно для юрлиц в поле "Фамилия" пишут название компании или оставляют пустым.
      setValue("last_name", client.company_name || "", opts);
      setValue("first_name", "Юр. лицо", opts);
    }

    // 3. Уведомление
    if (client.is_blacklisted) {
      toast.error(`ВНИМАНИЕ: Клиент ${displayName} в черном списке!`, {
        duration: 5000,
      });
    } else {
      toast.success(`Данные клиента ${displayName} подставлены`);
    }

    clearErrors();
    setPickedPhone(phoneValue);
  };

  return { applyFoundClient, isSelectionActive };
}
