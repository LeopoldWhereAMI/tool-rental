"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateProfile } from "@/services/profileService";
import { revalidatePath } from "next/cache";

type UpdateProfileResult =
  | { success: true }
  | { success: false; error: string };

export async function updateProfileAction(
  formData: FormData,
): Promise<UpdateProfileResult> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const fullName = formData.get("fullName")?.toString().trim();

    if (!fullName) {
      return { success: false, error: "Имя обязательно" };
    }

    await updateProfile(user.id, fullName);

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Неизвестная ошибка" };
  }
}

type UploadAvatarResult = { success: true } | { success: false; error: string };

export async function uploadAvatarAction(
  formData: FormData,
): Promise<UploadAvatarResult> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const file = formData.get("avatar") as File;

    if (!file) {
      return { success: false, error: "Файл не выбран" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Можно загружать только изображения" };
    }

    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: "Максимальный размер — 2MB" };
    }

    const filePath = user.id;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Неизвестная ошибка",
    };
  }
}

type DeleteAvatarResult = { success: true } | { success: false; error: string };

export async function deleteAvatarAction(): Promise<DeleteAvatarResult> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const filePath = user.id;

    const { error: storageError } = await supabase.storage
      .from("avatars")
      .remove([filePath]);

    if (storageError) {
      return { success: false, error: storageError.message };
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
}
