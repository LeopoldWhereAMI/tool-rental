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

    // 👉 ПОЛУЧАЕМ ТЕКУЩИЙ ШАБЛОН
    const { data: existingTemplate } = await supabase
      .from("contract_templates")
      .select(
        "id, html_content, updated_at, previous_html, previous_updated_at",
      )
      .eq("user_id", user.id)
      .maybeSingle();

    // =========================
    // 🔁 RESTORE
    // =========================
    if (action === "restore") {
      if (!existingTemplate?.previous_html) {
        return NextResponse.json({
          success: false,
          error: "Нет предыдущей версии",
        });
      }

      const { error } = await supabase
        .from("contract_templates")
        .update({
          html_content: existingTemplate.previous_html,
          updated_at: existingTemplate.previous_updated_at,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      return NextResponse.json({ success: true });
    }

    // =========================
    // 💾 SAVE
    // =========================
    const { error } = await supabase.from("contract_templates").upsert({
      id: existingTemplate?.id,
      user_id: user.id,

      // 👉 новое значение
      html_content,

      // 👉 сохраняем старое
      previous_html: existingTemplate?.html_content || null,
      previous_updated_at: existingTemplate?.updated_at || null,

      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API ошибка:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка сохранения" },
      { status: 500 },
    );
  }
}
