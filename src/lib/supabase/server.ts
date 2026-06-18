import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  // const supabaseUrl =
  //   process.env.SUPABASE_URL_PROXY || process.env.SUPABASE_URL;
  const isVercel = process.env.VERCEL === "1";
  const supabaseUrl = isVercel
    ? process.env.SUPABASE_URL!
    : process.env.SUPABASE_URL_PROXY || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }

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
        }
      },
    },
  });
}
