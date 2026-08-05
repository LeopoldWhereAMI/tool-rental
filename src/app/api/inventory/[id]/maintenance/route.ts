import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../../auth";
import { formatInventory } from "@/lib/formatters/inventoryFormatter";

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

    const body = await request.json();

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

    let item;

    // Сброс ТО
    if (body.reset) {
      item = await prisma.inventory.update({
        where: {
          id,
        },
        data: {
          workDaysCount: 0,
          lastMaintenanceDate: new Date(),
        },
      });
    }

    // Увеличение счетчика рабочих дней
    else if (typeof body.days === "number") {
      item = await prisma.inventory.update({
        where: {
          id,
        },
        data: {
          workDaysCount: {
            increment: body.days,
          },
          totalWorkDays: {
            increment: body.days,
          },
        },
      });
    }

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: "Не переданы данные для обновления",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: formatInventory(item),
    });
  } catch (error) {
    console.error("Ошибка ТО:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка обновления ТО",
      },
      {
        status: 500,
      },
    );
  }
}
