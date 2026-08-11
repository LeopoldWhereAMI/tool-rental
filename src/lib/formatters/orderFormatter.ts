import { Prisma } from "@/generated/prisma/client";
import { OrderTool } from "@/types";

export function formatRentalHistoryItem(
  item: Prisma.OrderItemGetPayload<{
    include: {
      order: {
        include: {
          client: true;
        };
      };
    };
  }>,
) {
  const client = item.order.client;

  let clientName = "Клиент не указан";

  if (client) {
    if (client.clientType === "individual") {
      clientName = `${client.lastName || ""} ${client.firstName || ""}`.trim();
    } else {
      clientName = client.companyName || "Компания не указана";
    }
  }

  const fallbackTotal =
    Math.max(
      1,
      Math.ceil(
        (item.endDate.getTime() - item.startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    ) * item.priceAtTime;

  return {
    id: item.id,
    order_id: item.order.id,
    start_date: item.startDate.toISOString(),
    end_date: item.endDate.toISOString(),
    total_price: item.totalPrice ?? fallbackTotal,
    status: item.order.status ?? undefined,
    client_name: clientName,
  };
}

type OrderListItem = Prisma.OrderGetPayload<{
  select: {
    id: true;
    totalPrice: true;
    startDate: true;
    endDate: true;
    orderNumber: true;
    status: true;

    client: {
      select: {
        id: true;
        lastName: true;
        firstName: true;
        middleName: true;
        phone: true;
        clientType: true;
        companyName: true;
      };
    };

    items: {
      select: {
        id: true;
        priceAtTime: true;
        startDate: true;
        endDate: true;
        isCustom: true;
        customName: true;

        inventory: {
          select: {
            id: true;
            name: true;
            serialNumber: true;
            imageUrl: true;
          };
        };
      };
    };
  };
}>;

export function formatOrder(order: OrderListItem) {
  const client = order.client;

  const clientName =
    client.clientType === "individual"
      ? `${client.lastName || ""} ${client.firstName || ""}`.trim()
      : client.companyName || "Компания не указана";

  const tools = order.items
    .filter((item) => item.inventory)
    .map((item) => ({
      id: item.inventory!.id,
      name: item.inventory!.name,
      serial_number: item.inventory!.serialNumber,
      image_url: item.inventory!.imageUrl,
      price_at_time: item.priceAtTime,
      start_date: item.startDate,
      end_date: item.endDate,
    }));

  let inventoryName = "Не указан";

  if (tools.length === 1) {
    inventoryName = tools[0].name;
  } else if (tools.length > 1) {
    inventoryName = `${tools[0].name} +${tools.length - 1}`;
  }

  return {
    id: order.id,
    order_number: order.orderNumber,
    status: order.status,

    total_price: order.totalPrice ? Number(order.totalPrice) : 0,

    start_date: order.startDate ?? tools[0]?.start_date,
    end_date: order.endDate ?? tools[0]?.end_date,

    client: {
      id: client.id,
      phone: client.phone,
      client_type: client.clientType,
      display_name: clientName,
    },

    inventory: {
      name: inventoryName,
    },

    tools,
  };
}

type OrderDetailsPayload = Prisma.OrderGetPayload<{
  include: {
    client: true;
    items: {
      include: {
        inventory: true;
      };
    };
  };
}>;

export function formatOrderDetails(order: OrderDetailsPayload) {
  const tools: OrderTool[] = order.items
    .filter((item) => item.inventory)
    .map((item) => ({
      id: item.inventory!.id,

      name: item.inventory!.name,
      category: item.inventory!.category ?? "",

      article: item.inventory!.article ?? "",
      serial_number: item.inventory!.serialNumber ?? "",

      status: item.inventory!.status as "available" | "rented" | "maintenance",

      image_url: item.inventory!.imageUrl,

      notes: item.inventory!.notes ?? "",

      daily_price: Number(item.inventory!.dailyPrice),

      purchase_price: item.inventory!.purchasePrice
        ? Number(item.inventory!.purchasePrice)
        : 0,

      purchase_date: item.inventory!.purchaseDate
        ? Number(item.inventory!.purchaseDate)
        : 0,

      created_at: item.inventory!.createdAt.toISOString(),
      updated_at: item.inventory!.updatedAt.toISOString(),

      work_days_count: item.inventory!.workDaysCount ?? 0,
      total_work_days: item.inventory!.totalWorkDays ?? 0,

      maintenance_interval_days: item.inventory!.maintenanceIntervalDays ?? 0,

      last_maintenance_date: item.inventory!.lastMaintenanceDate
        ? item.inventory!.lastMaintenanceDate.toISOString()
        : null,

      // поля заказа
      price_at_time: item.priceAtTime,

      start_date: item.startDate.toISOString(),

      end_date: item.endDate.toISOString(),
    }));

  const mainInventory = tools[0] ?? {
    id: "",
    name: "Не указан",
    image_url: null,
    daily_price: 0,
    serial_number: "",
    article: "",
  };

  return {
    id: order.id,

    order_number: order.orderNumber,

    status: order.status ?? "",

    total_price: order.totalPrice ? Number(order.totalPrice) : 0,

    security_deposit: order.securityDeposit ? Number(order.securityDeposit) : 0,

    start_date: order.startDate?.toISOString() ?? tools[0]?.start_date ?? "",

    end_date: order.endDate?.toISOString() ?? tools[0]?.end_date ?? "",

    created_at: order.createdAt.toISOString(),

    notes: order.notes ?? "",

    client: {
      ...order.client,

      first_name: order.client.firstName,
      last_name: order.client.lastName,
      middle_name: order.client.middleName,

      company_name: order.client.companyName,

      client_type: order.client.clientType,

      is_blacklisted: order.client.isBlacklisted,
    },

    inventory: mainInventory,

    tools,

    order_items: order.items.map((item) => ({
      id: item.id,

      price_at_time: item.priceAtTime,

      start_date: item.startDate.toISOString(),

      end_date: item.endDate.toISOString(),

      item_status: item.itemStatus,

      actual_return_date: item.actualReturnDate?.toISOString() ?? null,

      is_custom: item.isCustom,

      custom_name: item.customName,

      inventory: item.inventory
        ? {
            id: item.inventory.id,
            name: item.inventory.name,
            serial_number: item.inventory.serialNumber ?? "",
            article: item.inventory.article ?? "",
            image_url: item.inventory.imageUrl,
          }
        : null,
    })),
  };
}
