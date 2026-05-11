import { supabase } from "@/lib/supabase/supabase";

export async function getBookings(inventoryId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("inventory_id", inventoryId)
    .in("status", ["confirmed", "pending"]);

  if (error) throw error;

  return data;
}

export async function checkAvailability(
  inventoryId: string,
  startDate: Date,
  endDate: Date,
) {
  const { data, error } = await supabase.rpc("check_inventory_availability", {
    p_inventory_id: inventoryId,
    p_start_date: startDate.toISOString(),
    p_end_date: endDate.toISOString(),
  });

  if (error) throw error;

  return data[0];
}

export async function createBooking({
  inventoryId,
  clientId,
  startDate,
  endDate,
}: {
  inventoryId: string;
  clientId?: string | null;
  startDate: Date;
  endDate: Date;
}) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      inventory_id: inventoryId,
      client_id: clientId ?? null,
      start_date: startDate,
      end_date: endDate,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function cancelBooking(bookingId: string) {
  const { error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
    })
    .eq("id", bookingId);

  if (error) throw error;
}
