"use client";

import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { formatPrimaryRole, type SessionUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { navItems } from "@/lib/mock-data";

export function TopBar({ sessionUser }: { sessionUser: SessionUser | null }) {
  const pathname = usePathname();
  const current = navItems.find((item) => item.href === pathname);
  const formattedDate = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date());

  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/78 px-5 py-4 shadow-soft backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success">Caja principal abierta</Badge>
          <Badge tone="info">Sesion protegida</Badge>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">{formattedDate}</p>
        </div>
        <div className="mt-3">
          <h1 className="text-2xl font-semibold text-brand-text">{current?.label ?? "KaikoPOS"}</h1>
          <p className="mt-1 text-sm text-brand-muted">{current?.caption ?? "Operacion centralizada del turno actual"}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <LogoutButton />
        <div className="rounded-[20px] bg-brand-surface/80 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-muted">Perfil</p>
          <p className="text-sm font-medium text-brand-text">{sessionUser?.displayName ?? "Operador"}</p>
          <p className="text-xs text-brand-muted">{formatPrimaryRole(sessionUser?.roles[0])}</p>
        </div>
        <div className="rounded-[20px] bg-brand-secondary/60 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-muted">Sucursal</p>
          <p className="text-sm font-medium text-brand-text">KAIKO Principal</p>
        </div>
      </div>
    </header>
  );
}
