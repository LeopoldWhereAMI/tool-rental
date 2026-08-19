import { Prisma } from "@/generated/prisma/client";

type ClientDetailsPayload = Prisma.ClientGetPayload<{
  include: {
    orders: {
      select: {
        id: true;
        orderNumber: true;
        status: true;
        totalPrice: true;
        items: {
          select: {
            id: true;
            startDate: true;
            endDate: true;
            priceAtTime: true;
            inventory: {
              select: {
                id: true;
                name: true;
                imageUrl: true;
                serialNumber: true;
                article: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export function formatClientDetails(client: ClientDetailsPayload) {
  return {
    ...client,

    first_name: client.firstName,
    last_name: client.lastName,
    middle_name: client.middleName,

    company_name: client.companyName,
    client_type: client.clientType,

    created_at: client.createdAt,

    is_blacklisted: client.isBlacklisted,
    blacklisted_at: client.blacklistedAt,
    blacklist_reason: client.blacklistReason,

    orders: client.orders.map((order) => ({
      id: order.id,

      order_number: order.orderNumber,

      status: order.status,

      total_price: Number(order.totalPrice),

      start_date: order.items[0]?.startDate ?? "",
      end_date: order.items[0]?.endDate ?? "",

      tools: order.items.map((item) => ({
        id: item.id,
        name: item.inventory?.name ?? "",
        image_url: item.inventory?.imageUrl,
        serial_number: item.inventory?.serialNumber,
        price_at_time: item.priceAtTime,
        start_date: item.startDate,
        end_date: item.endDate,
      })),

      inventory: {
        id: order.items[0]?.inventory?.id,
        name: order.items[0]?.inventory?.name ?? "",
        image_url: order.items[0]?.inventory?.imageUrl,
        serial_number: order.items[0]?.inventory?.serialNumber,
        article: order.items[0]?.inventory?.article,
      },
    })),
  };
}
