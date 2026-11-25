import { prisma } from "@/lib/prisma";

export async function getProfile(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: {
      id: userId,
    },
  });

  if (!profile) {
    throw new Error("Профиль не найден");
  }

  return profile;
}

export async function updateProfile(userId: string, fullName: string) {
  return prisma.profile.upsert({
    where: {
      id: userId,
    },

    create: {
      id: userId,
      fullName,
    },

    update: {
      fullName,
    },
  });
}

export async function updateAvatar(userId: string, avatarUrl: string | null) {
  return prisma.profile.update({
    where: {
      id: userId,
    },

    data: {
      avatarUrl,
    },
  });
}
