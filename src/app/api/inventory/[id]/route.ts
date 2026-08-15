import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatInventory } from "@/lib/formatters/inventoryFormatter";
import { auth } from "../../../../../auth";
import { Prisma } from "@/generated/prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const item = await prisma.inventory.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: "Инструмент не найден",
        },
        {
          status: 404,
        },
      );
    }

    // Проверяем, находится ли инструмент сейчас в активной аренде
    const now = new Date();

    const activeOrderItem = await prisma.orderItem.findFirst({
      where: {
        inventoryId: id,
        userId: session.user.id,
        itemStatus: "active",
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
      select: {
        id: true,
      },
    });

    const formattedItem = formatInventory(item);

    // Если инструмент не в ремонте и есть активная аренда —
    // считаем его арендованным.
    const status =
      item.status === "maintenance"
        ? "maintenance"
        : activeOrderItem
          ? "rented"
          : "available";

    return NextResponse.json({
      success: true,
      data: {
        ...formattedItem,
        status,
      },
    });
  } catch (error) {
    console.error("Ошибка загрузки инструмента:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка загрузки инструмента",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const result = await prisma.inventory.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Инструмент не найден",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Ошибка удаления:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка удаления инструмента",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const existingItem = await prisma.inventory.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Инструмент не найден",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const data: Prisma.InventoryUpdateInput = {};

    if (body.name !== undefined) data.name = body.name;

    if (body.category !== undefined) data.category = body.category;

    if (body.status !== undefined) data.status = body.status;

    if (body.serial_number !== undefined)
      data.serialNumber = body.serial_number;

    if (body.daily_price !== undefined) data.dailyPrice = body.daily_price;

    if (body.purchase_price !== undefined)
      data.purchasePrice = body.purchase_price;

    if (body.purchase_date !== undefined) {
      data.purchaseDate = body.purchase_date
        ? new Date(body.purchase_date).getTime()
        : null;
    }

    if (body.notes !== undefined) data.notes = body.notes;

    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;

    const item = await prisma.inventory.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      success: true,
      data: formatInventory(item),
    });
  } catch (error) {
    console.error("Ошибка обновления инструмента:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка обновления инструмента",
      },
      {
        status: 500,
      },
    );
  }
}
