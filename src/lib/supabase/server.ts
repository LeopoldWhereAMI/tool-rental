// для прокси
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  // ✅ ВАЖНО: на сервере используем SUPABASE_URL (прямой), а не NEXT_PUBLIC_SUPABASE_URL
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }

  // return createServerClient(supabaseUrl, supabaseKey, {
  //   cookies: {
  //     getAll() {
  //       return cookieStore.getAll();
  //     },
  //     setAll(cookiesToSet) {
  //       cookiesToSet.forEach(({ name, value, options }) =>
  //         cookieStore.set(name, value, options),
  //       );
  //     },
  //   },
  // });
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Игнорируем ошибку установки cookie в Server Component
          // Обновление токена обрабатывается в proxy middleware
        }
      },
    },
  });
}
