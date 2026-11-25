import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";

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

    const rentedItems = await prisma.orderItem.findMany({
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

    const rentedInventoryIds = rentedItems
      .map((item) => item.inventoryId)
      .filter((id): id is string => id !== null);

    return NextResponse.json({
      success: true,
      data: rentedInventoryIds,
    });
  } catch (error) {
    console.error("Ошибка получения арендованного инвентаря:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка получения арендованного инвентаря",
      },
      {
        status: 500,
      },
    );
  }
}
