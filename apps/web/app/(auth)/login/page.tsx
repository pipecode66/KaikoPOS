import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD, AUTH_COOKIE_NAME } from "@/lib/auth";

export default async function LoginPage() {
  const cookieStore = await cookies();

  if (cookieStore.get(AUTH_COOKIE_NAME)?.value) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dashboard-glow px-4 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-none bg-white/70 p-8 shadow-lifted backdrop-blur lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-muted">KAIKOPOS</p>
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
          <p className="mt-2 text-sm text-brand-muted">
            Acceso demo protegido para el panel KaikoPOS. El backend mantiene autenticacion JWT y roles.
          </p>

          <LoginForm />

          <div className="mt-6 rounded-[20px] bg-brand-surface p-4 text-sm text-brand-muted">
            Demo:
            <p className="mt-2 text-brand-text">{DEMO_ADMIN_EMAIL}</p>
            <p className="text-brand-text">{DEMO_ADMIN_PASSWORD}</p>
            <div className="mt-4">
              <Button variant="secondary" size="sm" className="w-full" disabled>
                Usuario administrador
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
