import { MetricCard } from "@/components/dashboard/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenHeader } from "@/components/ui/screen-header";
import { dashboardMetrics, kitchenTickets, tableCards } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ScreenHeader
        eyebrow="Resumen diario"
        title="Operacion en tiempo real"
        description="Vista ejecutiva del turno actual con ventas, estado de mesas, cocina y alertas de abastecimiento."
        actions={<Button>Exportar cierre</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">Mesas</p>
              <h2 className="mt-2 text-2xl font-semibold text-brand-text">Mapa de sala</h2>
            </div>
            <Badge tone="info">{tableCards.filter((table) => table.status !== "available").length} activas</Badge>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {tableCards.slice(0, 4).map((table) => (
              <div key={table.id} className="rounded-[20px] bg-brand-surface p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-brand-text">{table.name}</p>
                  <Badge tone={table.status === "available" ? "success" : table.status === "pending" ? "warning" : "info"}>
                    {table.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-brand-muted">{table.area}</p>
                <p className="mt-4 text-lg font-semibold text-brand-text">{table.total ? formatCurrency(table.total) : "Sin consumo"}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">Cocina</p>
              <h2 className="mt-2 text-2xl font-semibold text-brand-text">Pulso del KDS</h2>
            </div>
            <Button variant="secondary">Abrir cocina</Button>
          </div>

          <div className="mt-5 space-y-3">
            {kitchenTickets.map((ticket) => (
              <div key={ticket.id} className="rounded-[20px] bg-brand-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-brand-text">{ticket.orderNumber}</p>
                    <p className="text-sm text-brand-muted">{ticket.table}</p>
                  </div>
                  <Badge tone={ticket.status === "pending" ? "warning" : ticket.status === "ready" ? "success" : "info"}>
                    {ticket.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-brand-muted">{ticket.items.map((item) => `${item.qty}x ${item.name}`).join(" · ")}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
