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

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,

        type: body.type,
        amount: body.amount,
        description: body.description,
        category: body.category,
        status: body.status,

        orderId: body.order_id ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Ошибка создания транзакции:", error);

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
        transactions,
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
