import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export type BookingInfo = {
  inventory_id: string;
  has_booking: boolean;
  start_date?: string;
  end_date?: string;
  formattedRange?: string;
};

export function useInventoryBookings(inventoryIds: string[]) {
  const [statuses, setStatuses] = useState<Record<string, BookingInfo>>({});

  useEffect(() => {
    if (!inventoryIds.length) return;

    async function fetchBookings() {
      const { data, error } = await supabase
        .from("bookings")
        .select("inventory_id, start_date, end_date")
        .in("inventory_id", inventoryIds)
        .in("status", ["confirmed", "pending"])
        .gte("end_date", new Date().toISOString())
        .order("start_date", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      const map: Record<string, BookingInfo> = {};

      inventoryIds.forEach((id) => {
        map[id] = { inventory_id: id, has_booking: false };
      });

      data?.forEach((booking) => {
        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);

        map[booking.inventory_id] = {
          inventory_id: booking.inventory_id,
          has_booking: true,
          start_date: booking.start_date,
          end_date: booking.end_date,
          formattedRange: `${format(start, "d MMM", { locale: ru })} — ${format(end, "d MMM", { locale: ru })}`,
        };
      });

      setStatuses(map);
    }

    fetchBookings();
  }, [inventoryIds.join(",")]);

  return statuses;
}
