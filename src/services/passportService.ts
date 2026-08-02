import { supabase } from "@/lib/supabase/supabase";
import { PassportInput } from "@/lib/validators/orderSchema";

export async function getPassport(clientId: string) {
  const { data, error } = await supabase
    .from("client_passports")
    .select("*")
    .eq("client_id", clientId)
    .maybeSingle();

  if (error) {
    console.error("Ошибка загрузки паспорта:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function upsertPassport(
  clientId: string,
  passport: PassportInput,
) {
  const { error } = await supabase.from("client_passports").upsert(
    {
      client_id: clientId,
      ...passport,
    },
    {
      onConflict: "client_id",
    },
  );

  if (error) {
    console.error("Ошибка сохранения паспорта:", error);
    throw new Error(error.message);
  }
}
