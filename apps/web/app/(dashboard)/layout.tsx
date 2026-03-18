import { ReactNode } from "react";
import { cookies } from "next/headers";

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { AUTH_USER_COOKIE_NAME, decodeSessionUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const sessionUser = decodeSessionUser(cookieStore.get(AUTH_USER_COOKIE_NAME)?.value);

  return (
    <div className="min-h-screen bg-dashboard-glow px-4 py-4 lg:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row">
        <Sidebar sessionUser={sessionUser} />
        <main className="flex-1 space-y-4">
          <TopBar sessionUser={sessionUser} />
          <section className="rounded-[32px] border border-white/70 bg-white/55 p-4 shadow-lifted backdrop-blur lg:p-6">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
