import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/../auth";
import {
  formatClient,
  formatClientForResponse,
} from "@/lib/formatters/clientFormatter";

export async function GET() {
  try {
    const session = await auth();

    const user = session?.user;

    if (!user) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      where: {
        userId: user.id,
      },
      include: {
        orders: {
          select: {
            id: true,
            status: true,
            totalPrice: true,
          },
        },
      },
      orderBy: {
        lastName: "asc",
      },
    });

    const formattedClients = clients.map(formatClient);

    return NextResponse.json(formattedClients);
  } catch (error) {
    console.error("Ошибка загрузки клиентов:", error);

    return NextResponse.json(
      { message: "Ошибка загрузки клиентов" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    const user = session?.user;

    if (!user) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const body = await request.json();

    const client = await prisma.client.upsert({
      where: {
        userId_phone: {
          userId: user.id,
          phone: body.phone,
        },
      },

      update: {},

      create: {
        userId: user.id,

        phone: body.phone,

        clientType: body.client_type,

        firstName: body.client_type === "individual" ? body.first_name : null,

        lastName: body.client_type === "individual" ? body.last_name : null,

        middleName: body.client_type === "individual" ? body.middle_name : null,

        companyName: body.client_type === "legal" ? body.company_name : null,

        inn: body.client_type === "legal" ? body.inn : null,

        kpp: body.client_type === "legal" ? body.kpp : null,

        ogrn: body.client_type === "legal" ? body.ogrn : null,

        legalAddress: body.client_type === "legal" ? body.legal_address : null,
      },
    });

    // return NextResponse.json(client);
    return NextResponse.json(formatClientForResponse(client));
  } catch (error) {
    console.error("Ошибка создания клиента:", error);

    return NextResponse.json(
      { message: "Ошибка создания клиента" },
      { status: 500 },
    );
  }
}
