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
    const amount = Number(body.amount);

    if (!Number.isInteger(days) || days <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Количество дней должно быть положительным целым числом",
        },
        { status: 400 },
      );
    }

    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Некорректная сумма продления",
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

      if (order.endDate) {
        const now = new Date();

        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

        const endDate = new Date(
          order.endDate.getFullYear(),
          order.endDate.getMonth(),
          order.endDate.getDate(),
        );

        if (endDate < today) {
          throw new Error("ORDER_EXPIRED");
        }
      }

      if (!order.endDate) {
        throw new Error("ORDER_HAS_NO_END_DATE");
      }

      const newEndDate = new Date(order.endDate);
      newEndDate.setDate(newEndDate.getDate() + days);

      const extension = await tx.orderExtension.create({
        data: {
          orderId,
          days,
          amount,
          paidAmount: 0,
        },
      });

      await tx.orderItem.updateMany({
        where: {
          orderId,
        },
        data: {
          endDate: newEndDate,
        },
      });

      const updatedOrder = await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          endDate: newEndDate,
        },
      });

      return {
        extension,
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
            error: "Нельзя продлить просроченный заказ",
          },
          { status: 400 },
        );
      }

      if (error.message === "ORDER_HAS_NO_END_DATE") {
        return NextResponse.json(
          {
            success: false,
            error: "У заказа отсутствует дата окончания",
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
