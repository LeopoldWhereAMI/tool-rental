import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getProfile, updateProfile } from "@/services/profileService";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const profile = await getProfile(session.user.id);

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Ошибка получения профиля:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Не удалось получить профиль",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const { fullName } = body;

    if (!fullName) {
      return NextResponse.json(
        {
          success: false,
          error: "Имя обязательно",
        },
        {
          status: 400,
        },
      );
    }

    const profile = await updateProfile(session.user.id, fullName);

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Ошибка обновления профиля:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Не удалось обновить профиль",
      },
      {
        status: 500,
      },
    );
  }
}
