"use client";

import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { navItems } from "@/lib/mock-data";

export function TopBar() {
  const pathname = usePathname();
  const current = navItems.find((item) => item.href === pathname);

  return (
    <header className="flex flex-col gap-4 rounded-[24px] border border-white/60 bg-white/75 px-5 py-4 shadow-soft backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">Turno activo</p>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-xl font-semibold text-brand-text">{current?.label ?? "Sandeli POS"}</h1>
          <Badge tone="success">Caja principal abierta</Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-[18px] bg-brand-surface px-4 py-2">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-muted">Perfil</p>
          <p className="text-sm font-medium text-brand-text">Sara Admin</p>
        </div>
        <div className="rounded-[18px] bg-brand-secondary/60 px-4 py-2">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-muted">Sucursal</p>
          <p className="text-sm font-medium text-brand-text">Sandeli Centro</p>
        </div>
      </div>
    </header>
  );
}
