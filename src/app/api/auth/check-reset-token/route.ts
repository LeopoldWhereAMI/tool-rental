import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Токен отсутствует",
        },
        {
          status: 400,
        },
      );
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Ссылка недействительна",
        },
        {
          status: 400,
        },
      );
    }

    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({
        where: {
          id: resetToken.id,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: "Срок действия ссылки истёк",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Check reset token error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка проверки ссылки",
      },
      {
        status: 500,
      },
    );
  }
}
