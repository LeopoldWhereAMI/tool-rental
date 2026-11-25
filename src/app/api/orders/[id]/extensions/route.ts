import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../../auth";

export async function POST(
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
        { status: 401 },
      );
    }

    const { id: orderId } = await params;
    const body = await request.json();

    const days = Number(body.days);
    const orderItemIds = body.orderItemIds;

    if (!Number.isInteger(days) || days <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Количество дней должно быть положительным целым числом",
        },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(orderItemIds) ||
      orderItemIds.length === 0 ||
      !orderItemIds.every((id) => typeof id === "string")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Не выбраны позиции для продления",
        },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: {
          id: orderId,
          userId: session.user.id,
        },
      });

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      if (order.status === "completed") {
        throw new Error("ORDER_ALREADY_COMPLETED");
      }

      const orderItems = await tx.orderItem.findMany({
        where: {
          id: {
            in: orderItemIds,
          },
          orderId,
        },
      });

      if (orderItems.length !== orderItemIds.length) {
        throw new Error("ORDER_ITEM_NOT_FOUND");
      }

      const now = new Date();

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Проверяем, что ни одна выбранная позиция не просрочена
      for (const orderItem of orderItems) {
        const endDate = new Date(
          orderItem.endDate.getFullYear(),
          orderItem.endDate.getMonth(),
          orderItem.endDate.getDate(),
        );

        if (endDate < today) {
          throw new Error("ORDER_EXPIRED");
        }
      }

      const extensions = [];

      // Продлеваем каждую выбранную позицию
      for (const orderItem of orderItems) {
        const amount = orderItem.priceAtTime * days;

        const newEndDate = new Date(orderItem.endDate);
        newEndDate.setDate(newEndDate.getDate() + days);

        const extension = await tx.orderExtension.create({
          data: {
            orderId,
            orderItemId: orderItem.id,
            days,
            amount,
            paidAmount: 0,
          },
        });

        await tx.orderItem.update({
          where: {
            id: orderItem.id,
          },
          data: {
            endDate: newEndDate,
          },
        });

        extensions.push(extension);
      }

      // Order.endDate = максимальная дата окончания всех позиций
      const updatedOrderItems = await tx.orderItem.findMany({
        where: {
          orderId,
        },
        select: {
          endDate: true,
        },
      });

      const orderEndDate = updatedOrderItems.reduce<Date | null>(
        (latest, item) => {
          if (!latest || item.endDate > latest) {
            return item.endDate;
          }

          return latest;
        },
        null,
      );

      const updatedOrder = await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          endDate: orderEndDate,
        },
      });

      return {
        extensions,
        order: updatedOrder,
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Ошибка создания продления:", error);

    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            error: "Заказ не найден",
          },
          { status: 404 },
        );
      }

      if (error.message === "ORDER_ITEM_NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            error: "Позиция заказа не найдена",
          },
          { status: 404 },
        );
      }

      if (error.message === "ORDER_ALREADY_COMPLETED") {
        return NextResponse.json(
          {
            success: false,
            error: "Нельзя продлить завершённый заказ",
          },
          { status: 400 },
        );
      }

      if (error.message === "ORDER_EXPIRED") {
        return NextResponse.json(
          {
            success: false,
            error: "Одна или несколько выбранных позиций просрочены",
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка создания продления",
      },
      { status: 500 },
    );
  }
}
