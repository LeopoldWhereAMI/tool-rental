// import { createBrowserClient } from "@supabase/ssr";

// export const supabase = createBrowserClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   {
//     auth: {
//       persistSession: true,
//       storageKey: "sb-api-auth-token",
//     },
//   },
// );

import { createBrowserClient } from "@supabase/ssr";

const isVercel = process.env.NEXT_PUBLIC_VERCEL === "1";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      storageKey: isVercel
        ? "sb-guicprnabbwmkpxhhrwg-auth-token"
        : "sb-api-auth-token",
    },
  },
);
