"use server";

import { updateProfile } from "@/services/profileService";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { UPLOADS_DIR } from "@/lib/uploadPath";

type UpdateProfileResult =
  | { success: true }
  | { success: false; error: string };

export async function updateProfileAction(
  formData: FormData,
): Promise<UpdateProfileResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const fullName = formData.get("fullName")?.toString().trim();

    if (!fullName) {
      return { success: false, error: "Имя обязательно" };
    }

    await updateProfile(session.user.id, fullName);
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
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const file = formData.get("avatar");

    if (!(file instanceof File)) {
      return { success: false, error: "Файл не выбран" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Можно загружать только изображения" };
    }

    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: "Максимальный размер — 2MB" };
    }

    const extension = path.extname(file.name).toLowerCase() || ".jpg";
    const fileName = `${session.user.id}${extension}`;

    const uploadDir = path.join(UPLOADS_DIR, "avatars");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const avatarUrl = `/api/images/avatars/${fileName}`;
    await prisma.profile.update({
      where: { id: session.user.id },
      data: { avatarUrl },
    });

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
}

type DeleteAvatarResult = { success: true } | { success: false; error: string };

export async function deleteAvatarAction(): Promise<DeleteAvatarResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const uploadDir = path.join(UPLOADS_DIR, "avatars");
    const files = await fs.readdir(uploadDir).catch(() => []);

    const userFiles = files.filter((file) =>
      file.startsWith(`${session.user.id}.`),
    );

    for (const file of userFiles) {
      await fs.unlink(path.join(uploadDir, file));
    }

    await prisma.profile.update({
      where: { id: session.user.id },
      data: { avatarUrl: null },
    });

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
}
