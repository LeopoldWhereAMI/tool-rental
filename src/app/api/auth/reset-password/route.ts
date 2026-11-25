import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Недостаточно данных",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Пароль должен быть не менее 6 символов",
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
          error: "Ссылка восстановления недействительна",
        },
        {
          status: 400,
        },
      );
    }

    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.deleteMany({
        where: {
          userId: resetToken.userId,
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

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          password: hashedPassword,
        },
      }),

      prisma.passwordResetToken.delete({
        where: {
          id: resetToken.id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Пароль изменён",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка изменения пароля",
      },
      {
        status: 500,
      },
    );
  }
}
