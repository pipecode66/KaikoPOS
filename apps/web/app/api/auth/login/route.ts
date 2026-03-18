import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_TOKEN_COOKIE_NAME,
  AUTH_USER_COOKIE_NAME,
  SESSION_MAX_AGE,
  encodeSessionUser,
  getBackendApiUrl
} from "@/lib/auth";

type BackendLoginResponse = {
  accessToken?: string;
  user?: {
    sub?: string;
    email?: string;
    displayName?: string;
    roles?: string[];
  };
  message?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ message: "Debes completar correo y contrasena" }, { status: 400 });
  }

  try {
    const backendResponse = await fetch(`${getBackendApiUrl()}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store",
      body: JSON.stringify({ email, password })
    });

    const payload = (await backendResponse.json().catch(() => null)) as BackendLoginResponse | null;

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: payload?.message ?? "No fue posible iniciar sesion" },
        { status: backendResponse.status }
      );
    }

    if (!payload?.accessToken || !payload.user?.sub || !payload.user.email || !payload.user.displayName) {
      return NextResponse.json({ message: "La respuesta de autenticacion no fue valida" }, { status: 502 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: payload.user.sub,
        email: payload.user.email,
        displayName: payload.user.displayName,
        roles: payload.user.roles ?? []
      }
    });

    response.cookies.set({
      name: AUTH_TOKEN_COOKIE_NAME,
      value: payload.accessToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE
    });

    response.cookies.set({
      name: AUTH_USER_COOKIE_NAME,
      value: encodeSessionUser({
        id: payload.user.sub,
        email: payload.user.email,
        displayName: payload.user.displayName,
        roles: payload.user.roles ?? []
      }),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "No fue posible conectar con el backend operativo" },
      { status: 503 }
    );
  }
}
