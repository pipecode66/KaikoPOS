import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AUTH_TOKEN_COOKIE_NAME, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD } from "@/lib/auth";

export default async function LoginPage() {
  const cookieStore = await cookies();

  if (cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dashboard-glow px-4 py-10">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(200,162,200,0.26),transparent_60%)]" />
      <div className="grid w-full max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="relative overflow-hidden border-white/70 bg-white/70 p-8 shadow-lifted backdrop-blur lg:p-10">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-primary/20 blur-3xl" />
          <div className="relative">
            <Badge tone="info">Operacion conectada</Badge>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.32em] text-brand-muted">KAIKOPOS</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-tight text-brand-text">
              Caja, salon y cocina dentro de un mismo pulso operativo.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-brand-muted">
              La interfaz prioriza velocidad, lectura inmediata y decisiones claras para turnos reales de restaurante.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["Apertura lista", "Caja principal disponible"],
                ["Despacho vivo", "Tickets y tiempos visibles"],
                ["Stock vigilado", "Alertas listas para accionar"]
              ].map(([title, value]) => (
                <div key={title} className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-soft">
                  <p className="text-sm text-brand-muted">{title}</p>
                  <p className="mt-2 text-xl font-semibold leading-7 text-brand-text">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(232,216,232,0.6),rgba(255,255,255,0.9))] p-6 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-muted">Checklist de turno</p>
                <div className="mt-4 space-y-3">
                  {[
                    "Autenticar al operador y abrir caja",
                    "Tomar pedidos y enviarlos a cocina",
                    "Cobrar, descontar inventario y cerrar turno"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-[18px] bg-white/85 px-4 py-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
                      <p className="text-sm font-medium text-brand-text">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[22px] bg-white/90 p-5 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">Acceso inicial</p>
                <p className="mt-3 text-sm leading-6 text-brand-muted">
                  Estas credenciales corresponden al usuario sembrado en el backend y ya autentican contra NestJS.
                </p>
                <div className="mt-4 space-y-2 rounded-[18px] bg-brand-surface/80 p-4">
                  <p className="text-sm font-medium text-brand-text">{INITIAL_ADMIN_EMAIL}</p>
                  <p className="text-sm font-medium text-brand-text">{INITIAL_ADMIN_PASSWORD}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-white/70 bg-white/92 p-7 shadow-lifted">
          <Badge tone="success">JWT + roles</Badge>
          <h2 className="mt-4 text-3xl font-semibold text-brand-text">Inicia sesion</h2>
          <p className="mt-2 text-sm text-brand-muted">
            El acceso del frontend ahora se apoya en el backend real y deja lista la sesion para conectar modulos sin rutas demo.
          </p>

          <LoginForm />

          <div className="mt-6 rounded-[24px] border border-black/5 bg-brand-surface/85 p-4 text-sm text-brand-muted">
            <p className="font-medium text-brand-text">Usuario administrador inicial</p>
            <p className="mt-2 text-brand-muted">
              Ideal para la primera configuracion de menu, usuarios, mesas y caja.
            </p>
            <Button variant="secondary" size="sm" className="mt-4 w-full" disabled>
              Listo para configuracion inicial
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
