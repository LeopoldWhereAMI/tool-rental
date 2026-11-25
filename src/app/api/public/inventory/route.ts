import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatInventory } from "@/lib/formatters/inventoryFormatter";

const PUBLIC_USER_ID = "8c89f646-04f0-4fce-a9ad-ace4672cbffc";

const allowedOrigins = [
  "https://masterskaya1.online",
  "https://www.masterskaya1.online",
  "https://rent-app-landing.vercel.app",
];

function getCorsOrigin(request: Request) {
  const origin = request.headers.get("origin");

  return origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
}

export async function GET(request: Request) {
  try {
    const items = await prisma.inventory.findMany({
      where: {
        userId: PUBLIC_USER_ID,
      },
      orderBy: {
        name: "asc",
      },
    });

    const activeOrderItems = await prisma.orderItem.findMany({
      where: {
        userId: PUBLIC_USER_ID,
        inventoryId: { not: null },
        itemStatus: "active",
        order: {
          status: {
            in: ["active", "pending"],
          },
        },
      },
      select: {
        inventoryId: true,
      },
    });

    const rentedIds = new Set(
      activeOrderItems
        .map((item) => item.inventoryId)
        .filter((id): id is string => id !== null),
    );

    const inventory = items.map((item) => {
      const formatted = formatInventory(item);

      return {
        ...formatted,
        status:
          rentedIds.has(item.id) && item.status !== "maintenance"
            ? "rented"
            : formatted.status,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: inventory,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": getCorsOrigin(request),
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  } catch (error) {
    console.error("Ошибка загрузки публичного инвентаря:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка загрузки инвентаря",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": getCorsOrigin(request),
        },
      },
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": getCorsOrigin(request),
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
