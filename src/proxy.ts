import { NextResponse } from "next/server";
import { auth } from "../auth";

export default auth((request) => {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/login";

  if (!request.auth && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
