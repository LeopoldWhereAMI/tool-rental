// import { supabase } from "@/lib/supabase/supabase";

// export const uploadInventoryImage = async (file: File) => {
//   try {
//     const fileExt = file.name.split(".").pop();
//     const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
//     const filePath = fileName;

//     const { error: uploadError } = await supabase.storage
//       .from("images")
//       .upload(filePath, file);

//     if (uploadError) {
//       console.error("Storage Error Detail:", uploadError);
//       throw uploadError;
//     }

//     const { data: urlData } = supabase.storage
//       .from("images")
//       .getPublicUrl(filePath);

//     if (!urlData) {
//       throw new Error("Не удалось получить публичную ссылку");
//     }

//     return urlData.publicUrl;
//   } catch (error: unknown) {
//     const message =
//       error instanceof Error ? error.message : "Неизвестная ошибка";
//     console.error("Storage Upload Error:", message);
//     throw new Error(message);
//   }
// };

// export const deleteImageByUrl = async (url: string | null) => {
//   if (!url) return;

//   try {
//     const bucketName = "images";
//     const urlParts = url.split(`${bucketName}/`);
//     if (urlParts.length < 2) return;

//     const pathPart = urlParts[1];

//     const { error } = await supabase.storage
//       .from(bucketName)
//       .remove([pathPart]);

//     if (error) throw error;
//   } catch (error) {
//     console.error("Ошибка при удалении файла из Storage:", error);
//   }
// };

// import { createBrowserClient } from "@supabase/ssr";

// Клиент для Storage — напрямую на Supabase (минуя прокси)
// const supabaseStorage = createBrowserClient(
//   "https://guicprnabbwmkpxhhrwg.supabase.co",
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// );

import { createClient } from "@supabase/supabase-js";

const supabaseStorage = createClient(
  "https://guicprnabbwmkpxhhrwg.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// export const uploadInventoryImage = async (file: File) => {
//   console.log("UPLOAD URL:", "https://guicprnabbwmkpxhhrwg.supabase.co");
//   try {
//     const fileExt = file.name.split(".").pop();
//     const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

//     const { error: uploadError } = await supabaseStorage.storage
//       .from("images")
//       .upload(fileName, file);

//     if (uploadError) {
//       console.error("Storage Error Detail:", uploadError);
//       throw uploadError;
//     }

//     // URL для чтения — через прокси
//     return `https://api.xn--46-6kcay4al8ahci5n.xn--p1ai/storage/v1/object/public/images/${fileName}`;
//   } catch (error: unknown) {
//     const message =
//       error instanceof Error ? error.message : "Неизвестная ошибка";
//     console.error("Storage Upload Error:", message);
//     throw new Error(message);
//   }
// };

export const uploadInventoryImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!data.success) throw new Error(data.error);

    return data.url;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    console.error("Storage Upload Error:", message);
    throw new Error(message);
  }
};

export const deleteImageByUrl = async (url: string | null) => {
  if (!url) return;

  try {
    const bucketName = "images";
    const urlParts = url.split(`${bucketName}/`);
    if (urlParts.length < 2) return;

    const pathPart = urlParts[1];

    const { error } = await supabaseStorage.storage
      .from(bucketName)
      .remove([pathPart]);

    if (error) throw error;
  } catch (error) {
    console.error("Ошибка при удалении файла из Storage:", error);
  }
};
