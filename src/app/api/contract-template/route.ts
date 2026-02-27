import { NextRequest, NextResponse } from "next/server";
import {
  getContractTemplate,
  saveContractTemplate,
  restoreContractTemplate,
} from "@/services/contractService";

export async function GET() {
  try {
    const template = await getContractTemplate();
    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("API ошибка:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Не удалось получить шаблон договора",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html_content, action } = body;

    if (!html_content && action !== "restore") {
      return NextResponse.json(
        {
          success: false,
          error: "html_content обязателен",
        },
        { status: 400 },
      );
    }

    if (action === "restore") {
      await restoreContractTemplate();
      return NextResponse.json({
        success: true,
        message: "Шаблон восстановлен",
      });
    }

    await saveContractTemplate(html_content);

    return NextResponse.json({
      success: true,
      message: "Шаблон договора сохранён",
    });
  } catch (error) {
    console.error("API ошибка:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при сохранении шаблона",
      },
      { status: 500 },
    );
  }
}
