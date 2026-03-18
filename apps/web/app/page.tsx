import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_TOKEN_COOKIE_NAME } from "@/lib/auth";

export default async function HomePage() {
  const cookieStore = await cookies();
  redirect(cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value ? "/dashboard" : "/login");
}
