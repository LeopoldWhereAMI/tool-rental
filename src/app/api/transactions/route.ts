import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../auth";

export async function POST(request: Request) {
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

    const body = await request.json();

    const transaction = await prisma.$transaction(async (tx) => {
      const extensionId = body.extension_id ?? null;

      if (
        extensionId &&
        body.status === "completed" &&
        body.type === "income"
      ) {
        const extension = await tx.orderExtension.findFirst({
          where: {
            id: extensionId,
            order: {
              userId: session.user.id,
            },
          },
        });

        if (!extension) {
          throw new Error("EXTENSION_NOT_FOUND");
        }

        const paymentAmount = Number(body.amount);
        const unpaidAmount =
          Number(extension.amount) - Number(extension.paidAmount);

        if (paymentAmount > unpaidAmount) {
          throw new Error("PAYMENT_EXCEEDS_EXTENSION");
        }

        await tx.orderExtension.update({
          where: {
            id: extensionId,
          },
          data: {
            paidAmount: {
              increment: body.amount,
            },
          },
        });
      }

      return tx.transaction.create({
        data: {
          userId: session.user.id,

          type: body.type,
          amount: body.amount,
          description: body.description,
          category: body.category,
          status: body.status,

          orderId: body.order_id ?? null,
          extensionId,
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        id: transaction.id,
        type: transaction.type,
        amount: Number(transaction.amount),
        description: transaction.description,
        category: transaction.category,
        status: transaction.status,
        order_id: transaction.orderId,
        extension_id: transaction.extensionId,
        created_at: transaction.createdAt,
      },
    });
  } catch (error) {
    console.error("Ошибка создания транзакции:", error);

    if (error instanceof Error) {
      if (error.message === "EXTENSION_NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            error: "Продление не найдено",
          },
          { status: 404 },
        );
      }

      if (error.message === "PAYMENT_EXCEEDS_EXTENSION") {
        return NextResponse.json(
          {
            success: false,
            error: "Сумма платежа превышает сумму неоплаченного продления",
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка создания транзакции",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 10);
    const type = searchParams.get("type");
    const orderId = searchParams.get("orderId");
    const skip = (page - 1) * pageSize;

    const where = {
      userId: session.user.id,
      status: {
        in: ["completed", "cancelled"],
      },
      ...(type
        ? {
            type,
          }
        : {}),
      ...(orderId
        ? {
            orderId,
          }
        : {}),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
      }),

      prisma.transaction.count({
        where,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        transactions: transactions.map((transaction) => ({
          id: transaction.id,
          type: transaction.type,
          amount: Number(transaction.amount),
          description: transaction.description,
          category: transaction.category,
          status: transaction.status,
          order_id: transaction.orderId,
          created_at: transaction.createdAt,
        })),
        total,
      },
    });
  } catch (error) {
    console.error("Ошибка загрузки транзакций:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка загрузки транзакций",
      },
      {
        status: 500,
      },
    );
  }
}
