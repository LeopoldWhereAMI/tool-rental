import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";

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

    const { inventoryId, startDate, endDate, excludeBookingId } = body;

    if (!inventoryId || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Не переданы обязательные параметры",
        },
        {
          status: 400,
        },
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Конфликты с заказами
    const conflictingOrders = await prisma.orderItem.findMany({
      where: {
        inventoryId,

        itemStatus: {
          in: ["active", "rented"],
        },

        order: {
          userId: session.user.id,
          status: {
            in: ["active", "pending"],
          },
        },

        NOT: {
          OR: [
            {
              endDate: {
                lt: start,
              },
            },
            {
              startDate: {
                gt: end,
              },
            },
          ],
        },
      },

      select: {
        id: true,
        orderId: true,
        startDate: true,
        endDate: true,
      },
    });

    // Конфликты с бронированиями
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        inventoryId,

        status: {
          in: ["confirmed", "pending"],
        },

        ...(excludeBookingId && {
          id: {
            not: excludeBookingId,
          },
        }),

        NOT: {
          OR: [
            {
              endDate: {
                lt: start,
              },
            },
            {
              startDate: {
                gt: end,
              },
            },
          ],
        },
      },

      select: {
        id: true,
        startDate: true,
        endDate: true,
      },
    });

    return NextResponse.json({
      success: true,

      data: {
        available:
          conflictingOrders.length === 0 && conflictingBookings.length === 0,

        conflictingOrders,
        conflictingBookings,
      },
    });
  } catch (error) {
    console.error("Ошибка проверки доступности:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка проверки доступности",
      },
      {
        status: 500,
      },
    );
  }
}
