"use server";

// import { createSupabaseServerClient } from "@/lib/supabase/server";

// export async function signUpAction(email: string, password: string) {
//   const supabase = await createSupabaseServerClient();

//   const { error } = await supabase.auth.signUp({
//     email,
//     password,
//   });

//   if (error) {
//     return { error: error.message, success: false };
//   }

//   return {
//     success: true,
//     message: "Регистрация успешна! Пожалуйста, войдите.",
//   };
// }

// export async function logoutAction() {
//   const supabase = await createSupabaseServerClient();

//   await supabase.auth.signOut();
//   return { success: true };
// }

"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signOut } from "../../../auth";

export async function signUpAction(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      success: false,
      error: "Пользователь уже существует",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return {
    success: true,
    message: "Регистрация успешна! Теперь войдите.",
  };
}

export async function logoutAction() {
  await signOut();

  return { success: true };
}
