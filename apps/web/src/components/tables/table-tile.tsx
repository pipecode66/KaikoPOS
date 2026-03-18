import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { TableCard } from "@/lib/types";

export function TableTile({ table }: { table: TableCard }) {
  const tone = table.status === "available" ? "success" : table.status === "pending" ? "warning" : "info";
  const label = table.status === "available" ? "Disponible" : table.status === "pending" ? "Pago pendiente" : "Ocupada";

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xl font-semibold text-brand-text">{table.name}</p>
          <p className="mt-1 text-sm text-brand-muted">
            {table.area} · {table.seats} puestos
          </p>
        </div>
        <Badge tone={tone}>{label}</Badge>
      </div>

      <div className="mt-5 rounded-[18px] bg-brand-surface p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-brand-muted">Ticket actual</p>
        <p className="mt-2 text-sm font-medium text-brand-text">{table.ticket ?? "Sin pedido activo"}</p>
        <p className="mt-1 text-lg font-semibold text-brand-text">
          {table.total ? formatCurrency(table.total) : formatCurrency(0)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="secondary">Mover</Button>
        <Button variant="ghost">Fusionar</Button>
      </div>
    </Card>
  );
}
