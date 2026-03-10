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

  // Пропускаем статику
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/login" ||
    pathname === "/favicon.ico" ||
    /\.(svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|js|css)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ОДИН запрос
  const { response, user } = await updateSession(request);

  if (!user && pathname !== "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|static|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
