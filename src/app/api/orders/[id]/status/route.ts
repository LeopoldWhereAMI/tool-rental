import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../../auth";

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

    const { status, totalPrice } = body;

    const inventoryStatus =
      status === "completed" || status === "cancelled" ? "available" : "rented";

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: {
          id,
        },
        data: {
          status,
          ...(totalPrice !== undefined && {
            totalPrice,
          }),
        },
      });

      const items = await tx.orderItem.findMany({
        where: {
          orderId: id,
        },
        select: {
          inventoryId: true,
        },
      });

      const inventoryIds = items
        .map((item) => item.inventoryId)
        .filter((id): id is string => id !== null);

      await tx.inventory.updateMany({
        where: {
          id: {
            in: inventoryIds,
          },
        },
        data: {
          status: inventoryStatus,
        },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Ошибка обновления статуса заказа:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка обновления статуса заказа",
      },
      {
        status: 500,
      },
    );
  }
}
