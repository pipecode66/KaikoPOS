import { NextRequest, NextResponse } from "next/server";

import { AUTH_TOKEN_COOKIE_NAME } from "@/lib/auth";

const protectedPaths = ["/dashboard", "/pos", "/tables", "/kitchen", "/cash-register", "/products", "/inventory", "/reports", "/users"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value);
  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/pos/:path*", "/tables/:path*", "/kitchen/:path*", "/cash-register/:path*", "/products/:path*", "/inventory/:path*", "/reports/:path*", "/users/:path*"]
};
