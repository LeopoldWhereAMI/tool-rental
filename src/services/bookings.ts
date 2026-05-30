import { supabase } from "@/lib/supabase/supabase";
import { toISODate } from "@/helpers/date";

export async function getBookings(inventoryId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("inventory_id", inventoryId)
    .in("status", ["confirmed", "pending"]);

  if (error) throw error;

  return data;
}
// просто так
export async function checkAvailability(
  inventoryId: string,
  startDate: Date,
  endDate: Date,
) {
  const { data, error } = await supabase.rpc("check_inventory_availability", {
    p_inventory_id: inventoryId,
    p_start_date: toISODate(startDate),
    p_end_date: toISODate(endDate),
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
      start_date: toISODate(startDate),
      end_date: toISODate(endDate),
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

export async function updateBooking(
  bookingId: string,
  updates: { notes?: string | null; phone?: string | null },
) {
  const { error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", bookingId);

  if (error) throw error;
}
