import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_TEMPLATE } from "@/constants/defaultContract";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("contract_templates")
      .select("html_content")
      .maybeSingle();

    if (error) throw error;

    const content = data?.html_content || DEFAULT_TEMPLATE;

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";

    console.error("API ошибка [GET]:", errorMessage);

    return NextResponse.json(
      { success: false, error: "Не удалось получить шаблон" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    const { html_content, action } = body;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (action === "restore") {
      return NextResponse.json({ success: true, message: "Восстановлено" });
    }

    const { error } = await supabase.from("contract_templates").upsert({
      html_content,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Сохранено" });
  } catch (error) {
    console.error("API ошибка:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка сохранения" },
      { status: 500 },
    );
  }
}
