// import { createSupabaseServerClient } from "@/lib/supabase/server";

// export async function getProfile(userId: string) {
//   const supabase = await createSupabaseServerClient();

//   const { data, error } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("id", userId)
//     .single();

//   if (error) throw error;

//   return data;
// }

// export async function updateProfile(userId: string, fullName: string) {
//   const supabase = await createSupabaseServerClient();

//   const { data, error } = await supabase
//     .from("profiles")
//     .upsert(
//       {
//         id: userId,
//         full_name: fullName,
//         updated_at: new Date().toISOString(),
//       },
//       { onConflict: "id" },
//     )
//     .select()
//     .single();

//   if (error) throw error;

//   return data;
// }

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
