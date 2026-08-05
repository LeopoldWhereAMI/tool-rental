import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";

export async function PATCH(
  request: Request,
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

    const body = await request.json();

    const transaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Ошибка обновления статуса транзакции:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка обновления статуса транзакции",
      },
      {
        status: 500,
      },
    );
  }
}
