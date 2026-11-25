import { NextResponse } from "next/server";
import { auth } from "../auth";

export default auth((request) => {
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/auth/reset-password"];

  const isPublicRoute = publicRoutes.includes(pathname);

  if (!request.auth && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
