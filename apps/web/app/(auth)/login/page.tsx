import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dashboard-glow px-4 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-none bg-white/70 p-8 shadow-lifted backdrop-blur lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-muted">Sandeli POS</p>
          <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-tight text-brand-text">
            Operacion clara para caja, mesas, cocina e inventario.
          </h1>
          <p className="mt-4 max-w-xl text-base text-brand-muted">
            MVP cloud-first pensado para restaurantes y cafes con flujo rapido, botones grandes y decisiones en dos toques.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Caja abierta", "1 turno activo"],
              ["Tickets cocina", "3 en proceso"],
              ["Alertas stock", "4 por revisar"]
            ].map(([title, value]) => (
              <div key={title} className="rounded-[22px] bg-white/85 p-5 shadow-soft">
                <p className="text-sm text-brand-muted">{title}</p>
                <p className="mt-2 text-2xl font-semibold text-brand-text">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-none bg-white p-7 shadow-lifted">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-muted">Ingreso seguro</p>
          <h2 className="mt-3 text-3xl font-semibold text-brand-text">Inicia sesion</h2>
          <p className="mt-2 text-sm text-brand-muted">Autenticacion JWT con roles para admin, caja, mesas y cocina.</p>

          <div className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-text">Correo</label>
              <Input defaultValue="admin@sandeli.local" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-text">Contrasena</label>
              <Input type="password" defaultValue="Demo1234!" />
            </div>
          </div>

          <Link href="/dashboard" className="mt-6 block">
            <Button size="lg" className="w-full">
              Entrar al sistema
            </Button>
          </Link>

          <div className="mt-6 rounded-[20px] bg-brand-surface p-4 text-sm text-brand-muted">
            Demo:
            <p className="mt-2 text-brand-text">admin@sandeli.local</p>
            <p className="text-brand-text">Demo1234!</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
