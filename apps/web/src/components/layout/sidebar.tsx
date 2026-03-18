"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { formatPrimaryRole, type SessionUser } from "@/lib/auth";
import { ingredients, kitchenTickets, navItems, tableCards } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function Sidebar({ sessionUser }: { sessionUser: SessionUser | null }) {
  const pathname = usePathname();
  const sections = ["Operacion", "Gestion"] as const;
  const quickStats = [
    { label: "Mesas activas", value: tableCards.filter((table) => table.status !== "available").length },
    { label: "Tickets cocina", value: kitchenTickets.filter((ticket) => ticket.status !== "delivered").length },
    { label: "Alertas stock", value: ingredients.filter((ingredient) => ingredient.stock <= ingredient.minimum).length }
  ];

  return (
    <aside className="w-full rounded-[30px] border border-white/70 bg-white/82 p-4 shadow-soft backdrop-blur lg:w-[310px]">
      <div className="rounded-[26px] bg-[linear-gradient(160deg,rgba(200,162,200,0.28),rgba(255,255,255,0.88))] p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">KAIKOPOS</p>
        <h2 className="mt-2 text-[2rem] font-semibold leading-none text-brand-text">Centro operativo</h2>
        <p className="mt-3 text-sm leading-6 text-brand-muted">
          Flujo unificado para caja, salon, cocina e inventario con lectura rapida para turnos de alta rotacion.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {quickStats.map((stat) => (
            <div key={stat.label} className="rounded-[18px] bg-white/90 px-3 py-3 text-center shadow-soft">
              <p className="text-lg font-semibold text-brand-text">{stat.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-brand-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <nav className="mt-5 space-y-5">
        {sections.map((section) => (
          <div key={section} className="space-y-2">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-muted">{section}</p>
            <div className="space-y-2">
              {navItems
                .filter((item) => item.section === section)
                .map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-start gap-3 rounded-[22px] border px-4 py-3 transition",
                        isActive
                          ? "border-white/70 bg-white text-brand-text shadow-soft"
                          : "border-transparent bg-transparent hover:border-white/70 hover:bg-white/60"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-10 w-10 items-center justify-center rounded-[16px] text-xs font-semibold transition",
                          isActive
                            ? "bg-brand-primary/35 text-brand-text shadow-soft"
                            : "bg-brand-surface text-brand-muted group-hover:bg-white"
                        )}
                      >
                        {item.label.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="space-y-0.5">
                        <span className="block text-sm font-medium text-brand-text">{item.label}</span>
                        <span className="block text-xs text-brand-muted">{item.caption}</span>
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-5 rounded-[24px] border border-black/5 bg-brand-surface/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">Sesion actual</p>
        <p className="mt-2 text-sm font-semibold text-brand-text">{sessionUser?.displayName ?? "Operador"}</p>
        <p className="mt-1 text-sm text-brand-muted">{formatPrimaryRole(sessionUser?.roles[0])}</p>
        <p className="mt-4 text-xs leading-5 text-brand-muted">
          Base visual reestructurada para integrarse luego con datos vivos por modulo.
        </p>
      </div>
    </aside>
  );
}
