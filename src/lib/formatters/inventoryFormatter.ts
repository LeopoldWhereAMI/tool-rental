import type { Inventory } from "@/generated/prisma/client";

export function formatInventory(item: Inventory) {
  return {
    id: item.id,

    created_at: item.createdAt.toISOString(),

    name: item.name,

    category: item.category ?? "",

    daily_price: Number(item.dailyPrice),

    purchase_price: item.purchasePrice ? Number(item.purchasePrice) : 0,

    purchase_date: item.purchaseDate ? Number(item.purchaseDate) : null,

    status: item.status as "available" | "rented" | "maintenance",

    notes: item.notes ?? "",

    updated_at: item.updatedAt.toISOString(),

    serial_number: item.serialNumber ?? "",

    article: item.article ?? "",

    image_url: item.imageUrl,

    work_days_count: item.workDaysCount ?? 0,

    total_work_days: item.totalWorkDays ?? 0,

    maintenance_interval_days: item.maintenanceIntervalDays ?? 30,

    last_maintenance_date: item.lastMaintenanceDate?.toISOString() ?? null,
  };
}
