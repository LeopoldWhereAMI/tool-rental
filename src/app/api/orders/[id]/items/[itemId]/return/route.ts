import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../../../../auth";
import { OrderItemStatus } from "@/generated/prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> },
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

    const { itemId } = await params;

    const body = await request.json();

    const action = body.action as "return" | "cancel";

    const itemStatus =
      action === "return" ? OrderItemStatus.returned : OrderItemStatus.rented;

    const actualReturnDate = action === "return" ? new Date() : null;

    const item = await prisma.$transaction(async (tx) => {
      const oldItem = await tx.orderItem.findUnique({
        where: {
          id: itemId,
        },
      });

      if (!oldItem) {
        throw new Error("Позиция заказа не найдена");
      }

      const updatedItem = await tx.orderItem.update({
        where: {
          id: itemId,
        },
        data: {
          itemStatus,
          actualReturnDate,
        },
      });

      if (oldItem.inventoryId) {
        // rented/active -> returned
        // освобождаем инструмент
        if (
          itemStatus === OrderItemStatus.returned &&
          oldItem.itemStatus !== OrderItemStatus.returned
        ) {
          await tx.inventory.update({
            where: {
              id: oldItem.inventoryId,
            },
            data: {
              status: "available",
            },
          });
        }

        // returned -> rented/active
        // снова занимаем инструмент
        if (
          itemStatus === OrderItemStatus.rented &&
          oldItem.itemStatus === OrderItemStatus.returned
        ) {
          await tx.inventory.update({
            where: {
              id: oldItem.inventoryId,
            },
            data: {
              status: "rented",
            },
          });
        }
      }

      return updatedItem;
    });

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Ошибка обновления возврата инструмента:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка обновления возврата инструмента",
      },
      {
        status: 500,
      },
    );
  }
}
