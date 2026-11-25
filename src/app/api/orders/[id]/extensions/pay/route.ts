import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../../../auth";

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

    const extensionIds = body.extensionIds;

    if (
      !Array.isArray(extensionIds) ||
      extensionIds.length === 0 ||
      !extensionIds.every((id) => typeof id === "string")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Не выбраны продления для оплаты",
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

      const extensions = await tx.orderExtension.findMany({
        where: {
          id: {
            in: extensionIds,
          },
          orderId,
        },
      });

      if (extensions.length !== extensionIds.length) {
        throw new Error("EXTENSION_NOT_FOUND");
      }

      for (const extension of extensions) {
        const unpaidAmount =
          Number(extension.amount) - Number(extension.paidAmount);

        if (unpaidAmount <= 0) {
          throw new Error("EXTENSION_ALREADY_PAID");
        }
      }

      const transactions = [];

      for (const extension of extensions) {
        const unpaidAmount =
          Number(extension.amount) - Number(extension.paidAmount);

        const transaction = await tx.transaction.create({
          data: {
            userId: session.user.id,
            orderId,
            extensionId: extension.id,

            type: "income",
            amount: unpaidAmount,
            status: "completed",

            description: `Оплата продления по заказу #${order.orderNumber}`,
            category: "OrderExtension",
          },
        });

        await tx.orderExtension.update({
          where: {
            id: extension.id,
          },
          data: {
            paidAmount: {
              increment: unpaidAmount,
            },
          },
        });

        transactions.push(transaction);
      }

      return {
        transactions,
        extensions,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        transactions: result.transactions.map((transaction) => ({
          id: transaction.id,
          amount: Number(transaction.amount),
          type: transaction.type,
          status: transaction.status,
          description: transaction.description,
          category: transaction.category,
          order_id: transaction.orderId,
          extension_id: transaction.extensionId,
          created_at: transaction.createdAt,
        })),

        extensions: result.extensions.map((extension) => ({
          id: extension.id,
          order_item_id: extension.orderItemId,
          days: extension.days,
          amount: Number(extension.amount),
          paid_amount: Number(extension.amount),
          created_at: extension.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Ошибка оплаты продлений:", error);

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

      if (error.message === "EXTENSION_NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            error: "Одно или несколько продлений не найдены",
          },
          { status: 404 },
        );
      }

      if (error.message === "EXTENSION_ALREADY_PAID") {
        return NextResponse.json(
          {
            success: false,
            error: "Одно или несколько продлений уже оплачены",
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка оплаты продлений",
      },
      { status: 500 },
    );
  }
}
