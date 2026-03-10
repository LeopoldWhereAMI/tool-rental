import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/supabase-middleware";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const skipList = ["/_next/", "/api/", "/login", "/favicon.ico"];

  const isStaticFile =
    /\.(svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|js|css|map)$/i.test(
      pathname,
    );
  const shouldSkip =
    skipList.some((path) => pathname.startsWith(path)) || isStaticFile;

  if (shouldSkip) {
    console.log(`[PROXY SKIP] ${pathname}`); // 🔍 для отладки
    return NextResponse.next();
  }

  console.log(`[PROXY CALL] ${pathname}`); // 🔍 для отладки
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - login (login page)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|login).*)",
  ],
};
