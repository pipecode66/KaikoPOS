import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, DEMO_ADMIN_EMAIL, DEMO_ADMIN_NAME, DEMO_ADMIN_PASSWORD } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";

  if (email !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
    return NextResponse.json({ message: "Credenciales invalidas" }, { status: 401 });
  }

  const response = NextResponse.json({
    success: true,
    user: {
      email: DEMO_ADMIN_EMAIL,
      name: DEMO_ADMIN_NAME
    }
  });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "authenticated",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
