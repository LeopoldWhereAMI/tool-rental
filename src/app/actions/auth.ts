"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loginAction(email: string, password: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  return { success: true };
}

export async function signUpAction(email: string, password: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  return {
    success: true,
    message: "Регистрация успешна! Пожалуйста, войдите.",
  };
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();
  return { success: true };
}
