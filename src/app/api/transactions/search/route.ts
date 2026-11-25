import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";
import { formatTransaction } from "@/lib/formatters/transactionFormatter";

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

    const query = searchParams.get("query") || "";

    const page = Number(searchParams.get("page") || 1);

    const pageSize = Number(searchParams.get("pageSize") || 10);

    const skip = (page - 1) * pageSize;

    const where = {
      userId: session.user.id,
      description: {
        contains: query,
        mode: "insensitive" as const,
      },
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
        transactions: transactions.map(formatTransaction),
        total,
      },
    });
  } catch (error) {
    console.error("Ошибка поиска транзакций:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка поиска транзакций",
      },
      {
        status: 500,
      },
    );
  }
}
