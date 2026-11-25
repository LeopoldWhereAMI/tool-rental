import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../../auth";
import { unlink } from "fs/promises";
import path from "path";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { imageUrl } = await request.json();

    const item = await prisma.inventory.updateMany({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        imageUrl,
      },
    });

    if (item.count === 0) {
      return NextResponse.json(
        { error: "Инструмент не найден" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Ошибка обновления фото" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const item = await prisma.inventory.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Инструмент не найден" },
        { status: 404 },
      );
    }

    // удаляем физический файл
    if (item.imageUrl) {
      const relativePath = item.imageUrl.replace("/api/images/", "");

      const fullPath = path.join(process.cwd(), "uploads", relativePath);

      try {
        await unlink(fullPath);
      } catch (error) {
        console.error("File delete error:", error);
      }
    }

    // очищаем ссылку в БД
    await prisma.inventory.update({
      where: {
        id,
      },
      data: {
        imageUrl: null,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete image error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Delete failed",
      },
      {
        status: 500,
      },
    );
  }
}
