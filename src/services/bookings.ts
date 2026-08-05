export async function getBookings(inventoryId: string) {
  const response = await fetch(
    `/api/bookings?inventoryId=${encodeURIComponent(inventoryId)}`,
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Не удалось загрузить бронирования");
  }

  return result.data;
}

export async function checkAvailability(
  inventoryId: string,
  startDate: Date,
  endDate: Date,
  excludeBookingId?: string,
) {
  const response = await fetch("/api/bookings/availability", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inventoryId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      excludeBookingId,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || "Не удалось проверить доступность инструмента",
    );
  }

  return result.data;
}

export async function createBooking({
  inventoryId,
  clientId,
  orderId,
  startDate,
  endDate,
}: {
  inventoryId: string;
  clientId?: string | null;
  orderId?: string | null;
  startDate: Date;
  endDate: Date;
}) {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inventoryId,
      clientId,
      orderId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Не удалось создать бронирование");
  }

  return result.data;
}

export async function cancelBooking(bookingId: string) {
  const response = await fetch(`/api/bookings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: bookingId,
      status: "cancelled",
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Ошибка отмены");
  }

  return result.data;
}

export async function updateBooking(
  bookingId: string,
  updates: {
    notes?: string | null;
    phone?: string | null;
  },
) {
  const response = await fetch("/api/bookings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: bookingId,
      ...updates,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Не удалось обновить бронирование");
  }

  return result.data;
}
