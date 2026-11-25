import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatInventory } from "@/lib/formatters/inventoryFormatter";
import { auth } from "../../../../auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const items = await prisma.inventory.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    const activeOrderItems = await prisma.orderItem.findMany({
      where: {
        userId: session.user.id,
        inventoryId: {
          not: null,
        },
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

    return NextResponse.json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    console.error("Ошибка загрузки инвентаря:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка загрузки инвентаря",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Не авторизован",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const item = await prisma.inventory.create({
      data: {
        name: body.name,
        article: body.article,
        category: body.category,

        serialNumber: body.serial_number,

        dailyPrice: body.daily_price,
        purchasePrice: body.purchase_price,

        purchaseDate: body.purchase_date,

        notes: body.notes,

        imageUrl: body.image_url,

        status: "available",

        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Ошибка добавления инструмента:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка добавления инструмента",
      },
      {
        status: 500,
      },
    );
  }
}
