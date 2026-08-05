import { Prisma } from "@/generated/prisma/client";

type ClientsListItem = Prisma.ClientGetPayload<{
  include: {
    orders: {
      select: {
        id: true;
        status: true;
        totalPrice: true;
      };
    };
  };
}>;

export function formatClient(client: ClientsListItem) {
  return {
    ...client,

    first_name: client.firstName,
    last_name: client.lastName,
    middle_name: client.middleName,

    company_name: client.companyName,
    client_type: client.clientType,

    is_blacklisted: client.isBlacklisted,
    blacklisted_at: client.blacklistedAt,
    blacklist_reason: client.blacklistReason,

    orders: client.orders.map((order) => ({
      ...order,
      total_price: Number(order.totalPrice),
    })),
  };
}
