// import { NextRequest, NextResponse } from "next/server";
// import { updateSession } from "@/lib/supabase/supabase-middleware";

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname === "/login" ||
//     pathname === "/auth/callback" ||
//     pathname === "/favicon.ico"

//   ) {
//     return NextResponse.next();
//   }

//   const { response, user } = await updateSession(request);

//   if (!user) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|login).*)"],
// };

import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/supabase-middleware";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Быстрый фильтр для статики и системных путей (пре-чеки)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/login" ||
    pathname === "/favicon.ico" ||
    pathname.includes(".") // Пропускаем файлы с расширениями (картинки, шрифты)
  ) {
    return NextResponse.next();
  }

  // 2. Обновляем сессию (здесь происходит запрос к Supabase)
  const { response, user } = await updateSession(request);

  // 3. Если пользователя нет и мы не на странице логина — редирект
  if (!user && pathname !== "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (страница логина)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
