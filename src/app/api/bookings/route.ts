import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { formatBooking } from "@/lib/formatters/bookingFormatter";
import { auth } from "../../../../auth";

type CreateBookingParams = {
  inventoryId: string;
  clientId?: string | null;
  orderId?: string | null;
  startDate: string;
  endDate: string;
};

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
    const inventoryId = searchParams.get("inventoryId");
    const inventoryIds = searchParams.get("inventoryIds")?.split(",");

    if (!inventoryId && !inventoryIds) {
      return NextResponse.json(
        {
          success: false,
          error: "inventoryId is required",
        },
        {
          status: 400,
        },
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ["confirmed", "pending"],
        },
        ...(inventoryId && {
          inventoryId,
        }),
        ...(inventoryIds && {
          inventoryId: {
            in: inventoryIds,
          },
        }),
      },
      orderBy: {
        startDate: "asc",
      },
    });
    console.log("BOOKINGS ROUTE HIT");
    return NextResponse.json({
      success: true,
      data: bookings.map(formatBooking),
    });
  } catch (error) {
    console.error("Ошибка загрузки бронирований:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка загрузки бронирований",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as CreateBookingParams;

    if (!body.inventoryId) {
      return NextResponse.json(
        {
          success: false,
          error: "inventoryId is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        {
          success: false,
          error: "startDate and endDate are required",
        },
        {
          status: 400,
        },
      );
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        inventoryId: body.inventoryId,
        clientId: body.clientId ?? null,
        orderId: body.orderId ?? null,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      data: formatBooking(booking),
    });
  } catch (error) {
    console.error("Ошибка создания бронирования:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка создания бронирования",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: Request) {
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

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking id required",
        },
        {
          status: 400,
        },
      );
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: body.id,
        userId: session.user.id,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Бронирование не найдено",
        },
        {
          status: 404,
        },
      );
    }

    const booking = await prisma.booking.update({
      where: {
        id: body.id,
      },
      data: {
        ...(body.status !== undefined && {
          status: body.status,
        }),
        ...(body.phone !== undefined && {
          phone: body.phone,
        }),
        ...(body.notes !== undefined && {
          notes: body.notes,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Ошибка обновления бронирования:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка обновления бронирования",
      },
      {
        status: 500,
      },
    );
  }
}
