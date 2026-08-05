import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export type BookingInfo = {
  inventory_id: string;
  has_booking: boolean;
  start_date?: string;
  end_date?: string;
  formattedRange?: string;
};

type BookingResponse = {
  inventory_id: string;
  start_date: string;
  end_date: string;
};

type BookingsApiResponse = {
  success: boolean;
  data: BookingResponse[];
};

export function useInventoryBookings(inventoryIds: string[]) {
  const [statuses, setStatuses] = useState<Record<string, BookingInfo>>({});

  const inventoryIdsKey = inventoryIds.join(",");

  useEffect(() => {
    if (!inventoryIdsKey) {
      return;
    }

    async function fetchBookings() {
      try {
        const ids = inventoryIdsKey.split(",");

        const response = await fetch(
          `/api/bookings?inventoryIds=${inventoryIdsKey}`,
        );

        const result: BookingsApiResponse = await response.json();

        if (!result.success) {
          return;
        }

        const map: Record<string, BookingInfo> = {};

        ids.forEach((id) => {
          map[id] = {
            inventory_id: id,
            has_booking: false,
          };
        });

        result.data.forEach((booking) => {
          const start = new Date(booking.start_date);
          const end = new Date(booking.end_date);

          map[booking.inventory_id] = {
            inventory_id: booking.inventory_id,
            has_booking: true,
            start_date: booking.start_date,
            end_date: booking.end_date,
            formattedRange: `${format(start, "d MMM", {
              locale: ru,
            })} — ${format(end, "d MMM", {
              locale: ru,
            })}`,
          };
        });

        setStatuses(map);
      } catch (error) {
        console.error("Ошибка загрузки броней", error);
      }
    }

    fetchBookings();
  }, [inventoryIdsKey]);

  return statuses;
}
