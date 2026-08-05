import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";
import { Prisma } from "@/generated/prisma/client";

type DashboardTransaction = Prisma.TransactionGetPayload<{
  include: {
    order: {
      include: {
        client: true;
      };
    };
  };
}>;

function getMonthlyProfit(
  transactions: DashboardTransaction[],
  year: number,
  month: number,
) {
  return transactions
    .filter((transaction) => {
      const date = transaction.createdAt;

      return date.getFullYear() === year && date.getMonth() + 1 === month;
    })
    .reduce((sum, transaction) => {
      const amount = Number(transaction.amount);

      if (transaction.type === "income") {
        return sum + amount;
      }

      return sum - amount;
    }, 0);
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

    const year = Number(searchParams.get("year") || new Date().getFullYear());

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        status: "completed",
      },
      include: {
        order: {
          include: {
            client: true,
          },
        },
      },
    });

    // -----------------------
    // Баланс
    // -----------------------

    const currentBalance = transactions.reduce((sum, transaction) => {
      const amount = Number(transaction.amount);

      return transaction.type === "income" ? sum + amount : sum - amount;
    }, 0);

    // -----------------------
    // Доход за сегодня
    // -----------------------

    const today = new Date();

    const dailyRevenue = transactions
      .filter((transaction) => {
        const date = transaction.createdAt;

        return (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        );
      })
      .reduce((sum, transaction) => {
        const amount = Number(transaction.amount);

        if (transaction.type === "income") {
          return sum + amount;
        }

        if (
          transaction.type === "expense" &&
          transaction.category !== "Withdraw"
        ) {
          return sum - amount;
        }

        return sum;
      }, 0);

    // -----------------------
    // Прибыль месяца
    // -----------------------

    const currentMonth = today.getMonth() + 1;

    const monthlyProfit = getMonthlyProfit(transactions, year, currentMonth);

    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    const previousYear = currentMonth === 1 ? year - 1 : year;

    const previousProfit = getMonthlyProfit(
      transactions,
      previousYear,
      previousMonth,
    );

    let trendPercent = 0;

    if (previousProfit > 0) {
      trendPercent = Math.round(
        ((monthlyProfit - previousProfit) / previousProfit) * 100,
      );
    } else if (monthlyProfit > 0) {
      trendPercent = 100;
    }

    // -----------------------
    // Доход компаний
    // -----------------------

    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const companyIncome = transactions
      .filter(
        (transaction) =>
          transaction.type === "income" &&
          transaction.order?.client?.clientType === "legal",
      )
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const companyIncomePercent =
      totalIncome > 0 ? Math.round((companyIncome / totalIncome) * 100) : 0;

    // -----------------------
    // Годовой график
    // -----------------------

    const yearlyData = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      income: 0,
      expense: 0,
      profit: 0,
    }));

    transactions.forEach((transaction) => {
      const date = transaction.createdAt;

      if (date.getFullYear() !== year) {
        return;
      }

      const monthIndex = date.getMonth();

      const amount = Number(transaction.amount);

      if (transaction.type === "income") {
        yearlyData[monthIndex].income += amount;
        yearlyData[monthIndex].profit += amount;
      }

      if (transaction.type === "expense") {
        yearlyData[monthIndex].expense += amount;
        yearlyData[monthIndex].profit -= amount;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          currentBalance,
          dailyRevenue,
          monthlyProfit,
          trendPercent,
          companyIncomePercent,
        },
        yearlyData,
      },
    });
  } catch (error) {
    console.error("Ошибка загрузки finance dashboard:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка загрузки dashboard",
      },
      {
        status: 500,
      },
    );
  }
}
