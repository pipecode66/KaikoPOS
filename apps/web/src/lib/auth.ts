export const AUTH_TOKEN_COOKIE_NAME = "kaiko_access_token";
export const AUTH_USER_COOKIE_NAME = "kaiko_user";
export const INITIAL_ADMIN_EMAIL = "admin@sandeli.com";
export const INITIAL_ADMIN_PASSWORD = "sandeli12@";
export const INITIAL_ADMIN_NAME = "Admin Kaiko";
export const SESSION_MAX_AGE = 60 * 60 * 12;

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
};

export function getBackendApiUrl() {
  const value = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  return value.replace(/\/$/, "");
}

export function encodeSessionUser(user: SessionUser) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

export function decodeSessionUser(value?: string | null): SessionUser | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionUser;
    if (!parsed?.id || !parsed?.email || !parsed?.displayName || !Array.isArray(parsed?.roles)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function formatPrimaryRole(role?: string) {
  switch (role) {
    case "admin":
      return "Administrador";
    case "cashier":
      return "Caja";
    case "waiter":
      return "Mesas";
    case "kitchen":
      return "Cocina";
    default:
      return "Operaciones";
  }
}
