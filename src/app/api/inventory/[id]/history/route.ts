import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../../auth";
import { formatRentalHistoryItem } from "@/lib/formatters/orderFormatter";

export async function GET(
  _request: Request,
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

    const url = new URL(_request.url);

    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const pageSize = 5;

    const where = {
      inventoryId: id,
      order: {
        userId: session.user.id,
      },
    };

    const items = await prisma.orderItem.findMany({
      where,
      include: {
        order: {
          include: {
            client: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await prisma.orderItem.count({
      where,
    });

    return NextResponse.json({
      success: true,
      data: items.map(formatRentalHistoryItem),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Ошибка загрузки истории аренды:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка загрузки истории аренды",
      },
      {
        status: 500,
      },
    );
  }
}
