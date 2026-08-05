import { Booking } from "@/generated/prisma/client";

export function formatBooking(booking: Booking) {
  return {
    id: booking.id,
    inventory_id: booking.inventoryId,
    client_id: booking.clientId,

    start_date: booking.startDate.toISOString().split("T")[0],
    end_date: booking.endDate.toISOString().split("T")[0],

    status: booking.status,
    phone: booking.phone,
    notes: booking.notes,
  };
}
