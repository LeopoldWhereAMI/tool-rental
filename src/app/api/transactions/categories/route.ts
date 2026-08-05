import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";

export async function GET() {
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

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        status: "completed",
      },
      select: {
        category: true,
        type: true,
        amount: true,
      },
    });

    const stats = new Map<string, number>();

    transactions.forEach((transaction) => {
      const key = `${transaction.category ?? "Без категории"}-${transaction.type}`;

      stats.set(key, (stats.get(key) || 0) + Number(transaction.amount));
    });

    const result = Array.from(stats).map(([key, amount]) => {
      const [category, type] = key.split("-");

      return {
        category,
        amount,
        type,
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Ошибка получения статистики категорий:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка получения статистики категорий",
      },
      {
        status: 500,
      },
    );
  }
}
