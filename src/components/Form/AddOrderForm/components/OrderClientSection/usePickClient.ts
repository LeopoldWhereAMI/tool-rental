import { useState } from "react";
import { UseFormSetValue, UseFormClearErrors } from "react-hook-form";
import { OrderInput } from "@/lib/validators/orderSchema";
import { Client } from "@/types";
import { toast } from "sonner";

export default function usePickClient(
  watchedPhone: string | undefined,
  setValue: UseFormSetValue<OrderInput>,
  clearErrors: UseFormClearErrors<OrderInput>,
) {
  const [pickedPhone, setPickedPhone] = useState<string | undefined>();

  const isSelectionActive =
    pickedPhone !== undefined && watchedPhone === pickedPhone;

  const applyFoundClient = (client: Client) => {
    const opts = { shouldValidate: true, shouldDirty: true, shouldTouch: true };
    const phoneValue = client.phone ?? "";

    setValue("last_name", client.last_name, opts);
    setValue("first_name", client.first_name, opts);
    setValue("middle_name", client.middle_name || "", opts);
    setValue("phone", phoneValue, opts);

    const isBlacklisted = client.is_blacklisted;
    if (isBlacklisted) {
      toast.error(`ВНИМАНИЕ: Клиент ${client.last_name} в черном списке!`, {
        duration: 5000,
      });
    } else {
      toast.success(`Данные клиента ${client.last_name} подставлены`);
    }

    clearErrors();
    setPickedPhone(phoneValue);
  };

  return { applyFoundClient, isSelectionActive };
}
