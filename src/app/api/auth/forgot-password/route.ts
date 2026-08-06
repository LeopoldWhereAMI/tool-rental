import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email обязателен",
        },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Не говорим пользователю, существует ли такой email
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Если такой email существует, письмо будет отправлено",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 час

    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
        },
      }),

      prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      }),
    ]);

    const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${token}`;
    console.log("RESET URL:", resetUrl);
    await sendEmail({
      to: user.email,
      subject: "Восстановление пароля",
      html: `
    <div>
      <h2>Восстановление пароля</h2>

      <p>
        Вы запросили восстановление пароля для аккаунта.
      </p>

      <p>
        Перейдите по ссылке:
      </p>

      <a href="${resetUrl}">
        Восстановить пароль
      </a>

      <p>
        Ссылка действует 1 час.
      </p>

      <p>
        Если вы не запрашивали восстановление — просто проигнорируйте письмо.
      </p>
    </div>
  `,
    });

    return NextResponse.json({
      success: true,
      message: "Ссылка для восстановления создана",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка восстановления пароля",
      },
      {
        status: 500,
      },
    );
  }
}
