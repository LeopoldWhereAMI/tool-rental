import { supabase } from "@/lib/supabase";

export const uploadInventoryImage = async (file: File) => {
  try {
    const fileExt = file.name.split(".").pop();
    // Используем время + случайную строку для 100% уникальности
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = fileName;

    // 1. Загрузка файла (переименовали data в uploadData)
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage Error Detail:", uploadError);
      throw uploadError;
    }

    // 2. Получение публичной ссылки (переименовали data в urlData)
    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    if (!urlData) {
      throw new Error("Не удалось получить публичную ссылку");
    }

    return urlData.publicUrl;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    console.error("Storage Upload Error:", message);
    throw new Error(message);
  }
};

/**
 * Удаляет файл из хранилища по его публичному URL
 */
export const deleteImageByUrl = async (url: string | null) => {
  if (!url) return;

  try {
    const bucketName = "images";
    // Извлекаем имя файла из URL
    const urlParts = url.split(`${bucketName}/`);
    if (urlParts.length < 2) return;

    const pathPart = urlParts[1];

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([pathPart]);

    if (error) throw error;
  } catch (error) {
    console.error("Ошибка при удалении файла из Storage:", error);
  }
};
