import { supabase } from "@/lib/supabase/supabase";

/**
 * Получить текущий HTML шаблона договора
 */
export const getContractTemplate = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from("contract_templates")
      .select("html_content")
      .limit(1)
      .single();

    if (error) throw error;
    return data?.html_content || "";
  } catch (error) {
    console.error("Ошибка при получении шаблона договора:", error);
    throw error;
  }
};

/**
 * Сохранить новый HTML шаблон договора
 * Автоматически сохраняет предыдущую версию для отката
 */
export const saveContractTemplate = async (
  htmlContent: string,
): Promise<void> => {
  try {
    // 1. Пытаемся получить текущие данные (может вернуть null, если таблица пуста)
    const { data: currentData } = await supabase
      .from("contract_templates")
      .select("html_content, updated_at")
      .eq("id", 1)
      .maybeSingle(); // Используем maybeSingle, чтобы не падать с ошибкой на пустой таблице

    // 2. Используем UPSERT вместо UPDATE
    const { error } = await supabase.from("contract_templates").upsert(
      {
        id: 1, // Обязательно указываем ID для корректной работы upsert
        html_content: htmlContent,
        previous_html: currentData?.html_content || null,
        previous_updated_at: currentData?.updated_at || null,
        updated_at: new Date().toISOString(), // Обновляем дату
      },
      { onConflict: "id" },
    ); // Указываем, по какому полю проверять конфликт

    if (error) throw error;
  } catch (error) {
    console.error("Ошибка при сохранении шаблона договора:", error);
    throw error;
  }
};

/**
 * Откатиться к предыдущей версии договора
 */
export const restoreContractTemplate = async (): Promise<void> => {
  try {
    const { data: current } = await supabase
      .from("contract_templates")
      .select("html_content, previous_html")
      // .limit(1)
      .eq("id", 1) // Используем eq вместо limit
      .single();

    if (!current?.previous_html) {
      throw new Error("Нет предыдущей версии для отката");
    }

    // Откатываемся: текущее становится previous, а previous становится html_content
    const { error } = await supabase
      .from("contract_templates")
      .update({
        html_content: current.previous_html,
        previous_html: current.html_content,
      })
      // .limit(1);
      .eq("id", 1); // Используем eq вместо limit

    if (error) throw error;
  } catch (error) {
    console.error("Ошибка при откате шаблона договора:", error);
    throw error;
  }
};
