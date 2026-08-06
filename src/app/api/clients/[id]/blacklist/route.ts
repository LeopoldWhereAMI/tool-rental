import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../../auth";

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

    const client = await prisma.client.update({
      where: {
        id,
      },
      data: {
        isBlacklisted: body.isBlacklisted,
        blacklistReason: body.reason ?? null,
        blacklistedAt: body.isBlacklisted ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error("Blacklist error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка изменения чёрного списка",
      },
      {
        status: 500,
      },
    );
  }
}
