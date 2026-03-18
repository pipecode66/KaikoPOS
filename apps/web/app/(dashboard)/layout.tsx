import { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-dashboard-glow px-4 py-4 lg:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row">
        <Sidebar />
        <main className="flex-1 space-y-4">
          <TopBar />
          <section className="rounded-[28px] border border-white/70 bg-white/50 p-4 shadow-lifted backdrop-blur lg:p-6">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
