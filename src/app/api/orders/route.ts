import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../auth";
import { formatOrder } from "@/lib/formatters/orderFormatter";
import { CreateOrderParams } from "@/types";

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

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        totalPrice: true,
        startDate: true,
        endDate: true,
        orderNumber: true,
        status: true,

        client: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
            middleName: true,
            phone: true,
            clientType: true,
            companyName: true,
          },
        },

        items: {
          select: {
            id: true,
            priceAtTime: true,
            startDate: true,
            endDate: true,

            isCustom: true,
            customName: true,

            inventory: {
              select: {
                id: true,
                name: true,
                serialNumber: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: orders.map(formatOrder),
    });
  } catch (error) {
    console.error("Ошибка загрузки заказов:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка загрузки заказов",
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
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = (await request.json()) as CreateOrderParams;

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        clientId: body.client_id,
        totalPrice: body.total_price,
        securityDeposit: body.security_deposit,
        status: "active",
        orderNumber: "1",

        items: {
          create: body.items.map((item) => ({
            inventoryId: item.is_custom ? null : item.id,

            userId: session.user.id,

            startDate: new Date(item.start_date),
            endDate: new Date(item.end_date),

            priceAtTime: item.total_price ?? 0,

            isCustom: item.is_custom ?? false,
            customName: item.custom_name ?? null,

            itemStatus: "active",
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        order_number: order.orderNumber,
      },
    });
  } catch (error) {
    console.error("Ошибка создания заказа:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка создания заказа",
      },
      {
        status: 500,
      },
    );
  }
}
