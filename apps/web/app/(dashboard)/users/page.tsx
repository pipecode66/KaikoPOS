import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenHeader } from "@/components/ui/screen-header";
import { auditTrail, users } from "@/lib/mock-data";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <ScreenHeader
        eyebrow="Seguridad"
        title="Usuarios y auditoria"
        description="Asignacion de roles, activacion de cuentas y trazabilidad de acciones criticas del sistema."
        actions={<Button>Nuevo usuario</Button>}
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <h2 className="text-2xl font-semibold text-brand-text">Equipo</h2>
            <Badge tone="info">{users.length} cuentas</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-brand-surface text-brand-muted">
                <tr>
                  <th className="px-5 py-4 font-medium">Usuario</th>
                  <th className="px-5 py-4 font-medium">Rol</th>
                  <th className="px-5 py-4 font-medium">Estado</th>
                  <th className="px-5 py-4 font-medium">Ultimo acceso</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-black/5">
                    <td className="px-5 py-4">
                      <p className="font-medium text-brand-text">{user.name}</p>
                      <p className="text-brand-muted">{user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-brand-muted">{user.role}</td>
                    <td className="px-5 py-4">
                      <Badge tone={user.status === "active" ? "success" : "warning"}>
                        {user.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-brand-muted">{user.lastAccess}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-2xl font-semibold text-brand-text">Audit log</h2>
          <div className="mt-5 space-y-3">
            {auditTrail.map((entry) => (
              <div key={entry.id} className="rounded-[18px] bg-brand-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-brand-text">{entry.action}</p>
                    <p className="text-sm text-brand-muted">
                      {entry.actor} · {entry.context}
                    </p>
                  </div>
                  <p className="text-sm text-brand-muted">{entry.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
