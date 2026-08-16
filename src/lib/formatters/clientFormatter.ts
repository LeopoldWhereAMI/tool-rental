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

    created_at: client.createdAt,
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

type ClientItem = Prisma.ClientGetPayload<{
  select: {
    id: true;
    createdAt: true;
    userId: true;
    isBlacklisted: true;
    blacklistedAt: true;
    blacklistReason: true;
    clientType: true;
    phone: true;
    firstName: true;
    lastName: true;
    middleName: true;
    companyName: true;
    inn: true;
    kpp: true;
    ogrn: true;
    legalAddress: true;
  };
}>;

export function formatClientForResponse(client: ClientItem) {
  return {
    ...client,

    created_at: client.createdAt,
    first_name: client.firstName,
    last_name: client.lastName,
    middle_name: client.middleName,

    company_name: client.companyName,
    client_type: client.clientType,

    is_blacklisted: client.isBlacklisted,
    blacklisted_at: client.blacklistedAt,
    blacklist_reason: client.blacklistReason,
  };
}
