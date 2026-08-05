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

    const items = await prisma.orderItem.findMany({
      where: {
        inventoryId: id,
        order: {
          userId: session.user.id,
        },
      },
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
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: items.map(formatRentalHistoryItem),
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
