import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/supabase-middleware";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаем проверку для страницы логина и auth callback
  if (pathname === "/login" || pathname === "/auth/callback") {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
