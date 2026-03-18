"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-[24px] border border-white/60 bg-white/80 p-4 shadow-soft backdrop-blur lg:w-[280px]">
      <div className="rounded-[20px] bg-brand-primary/35 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-muted">Sandeli POS</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-text">Restaurant Ops</h2>
        <p className="mt-1 text-sm text-brand-muted">MVP operativo para caja, mesas, cocina e inventario.</p>
      </div>

      <nav className="mt-5 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start gap-3 rounded-[18px] px-4 py-3 transition",
                isActive ? "bg-brand-secondary text-brand-text shadow-soft" : "hover:bg-brand-secondary/40"
              )}
            >
              <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-xs font-semibold shadow-soft">
                {item.label.slice(0, 2).toUpperCase()}
              </span>
              <span className="space-y-0.5">
                <span className="block text-sm font-medium text-brand-text">{item.label}</span>
                <span className="block text-xs text-brand-muted">{item.caption}</span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
