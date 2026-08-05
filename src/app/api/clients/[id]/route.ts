import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import { formatClientDetails } from "@/lib/formatters/clientDetailsFormatter";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;

    const client = await prisma.client.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalPrice: true,

            items: {
              select: {
                id: true,
                startDate: true,
                endDate: true,
                priceAtTime: true,

                inventory: {
                  select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                    serialNumber: true,
                    article: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { message: "Клиент не найден" },
        { status: 404 },
      );
    }

    const formattedClient = formatClientDetails(client);
    return NextResponse.json(formattedClient);
  } catch (error) {
    console.error("Ошибка загрузки клиента:", error);

    return NextResponse.json(
      { message: "Ошибка загрузки клиента" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingClient) {
      return NextResponse.json(
        { message: "Клиент не найден" },
        { status: 404 },
      );
    }

    const updatedClient = await prisma.client.update({
      where: {
        id,
      },
      data: {
        phone: body.phone,

        clientType: body.client_type,

        firstName: body.client_type === "individual" ? body.first_name : null,

        lastName: body.client_type === "individual" ? body.last_name : null,

        middleName:
          body.client_type === "individual" ? body.middle_name || null : null,

        companyName: body.client_type === "legal" ? body.company_name : null,

        inn: body.client_type === "legal" ? body.inn || null : null,

        kpp: body.client_type === "legal" ? body.kpp || null : null,

        ogrn: body.client_type === "legal" ? body.ogrn || null : null,

        legalAddress:
          body.client_type === "legal" ? body.legal_address || null : null,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("Ошибка обновления клиента:", error);

    return NextResponse.json(
      { message: "Ошибка обновления клиента" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;

    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingClient) {
      return NextResponse.json(
        { message: "Клиент не найден" },
        { status: 404 },
      );
    }

    const ordersCount = await prisma.order.count({
      where: {
        clientId: id,
        userId: session.user.id,
      },
    });

    if (ordersCount > 0) {
      return NextResponse.json(
        {
          message: "Нельзя удалить клиента с существующими заказами",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.client.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Клиент удалён",
    });
  } catch (error) {
    console.error("Ошибка удаления клиента:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Ошибка удаления клиента",
      },
      {
        status: 500,
      },
    );
  }
}
