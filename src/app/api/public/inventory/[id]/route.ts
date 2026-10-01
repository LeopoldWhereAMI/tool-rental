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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const item = await prisma.inventory.findFirst({
      where: { id, userId: PUBLIC_USER_ID },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Инструмент не найден" },
        {
          status: 404,
          headers: { "Access-Control-Allow-Origin": getCorsOrigin(request) },
        },
      );
    }

    const activeOrder = await prisma.orderItem.findFirst({
      where: {
        userId: PUBLIC_USER_ID,
        inventoryId: id,
        itemStatus: "active",
        order: { status: { in: ["active", "pending"] } },
      },
      select: { id: true },
    });

    const formatted = formatInventory(item);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...formatted,
          status:
            activeOrder && item.status !== "maintenance"
              ? "rented"
              : formatted.status,
        },
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
    console.error(`Ошибка загрузки инструмента ${id}:`, error);

    return NextResponse.json(
      { success: false, error: "Ошибка загрузки инструмента" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": getCorsOrigin(request) },
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
