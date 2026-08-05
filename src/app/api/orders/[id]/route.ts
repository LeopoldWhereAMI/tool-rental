import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";
import { formatOrderDetails } from "@/lib/formatters/orderFormatter";

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

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        client: true,

        items: {
          include: {
            inventory: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Заказ не найден",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: formatOrderDetails(order),
    });
  } catch (error) {
    console.error("Ошибка загрузки заказа:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка загрузки заказа",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
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

    await prisma.$transaction(async (tx) => {
      // Находим инструменты заказа
      const orderItems = await tx.orderItem.findMany({
        where: {
          orderId: id,
        },
        select: {
          inventoryId: true,
        },
      });

      const inventoryIds = orderItems
        .map((item) => item.inventoryId)
        .filter((id): id is string => id !== null);

      // Освобождаем инструменты
      if (inventoryIds.length > 0) {
        await tx.inventory.updateMany({
          where: {
            id: {
              in: inventoryIds,
            },
          },
          data: {
            status: "available",
          },
        });
      }

      // Удаляем заказ
      await tx.order.delete({
        where: {
          id,
        },
      });
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Ошибка удаления заказа:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка удаления заказа",
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

    const body = await request.json();

    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        notes: body.notes,
      },
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Ошибка обновления заметок заказа:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка обновления заметок заказа",
      },
      {
        status: 500,
      },
    );
  }
}
