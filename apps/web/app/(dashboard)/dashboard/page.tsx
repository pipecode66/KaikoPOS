import { MetricCard } from "@/components/dashboard/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenHeader } from "@/components/ui/screen-header";
import { formatCurrency } from "@/lib/format";
import { dashboardMetrics, ingredients, kitchenTickets, tableCards } from "@/lib/mock-data";

export default function DashboardPage() {
  const occupiedTables = tableCards.filter((table) => table.status !== "available");
  const lowStockCount = ingredients.filter((ingredient) => ingredient.stock <= ingredient.minimum).length;

  return (
    <div className="space-y-6">
      <ScreenHeader
        eyebrow="Resumen diario"
        title="Operacion en tiempo real"
        description="Vista ejecutiva del turno actual con ventas, estado de mesas, cocina y alertas de abastecimiento."
        chips={["Caja abierta", `${occupiedTables.length} mesas activas`, `${lowStockCount} alertas de stock`]}
        actions={<Button>Exportar cierre</Button>}
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-none bg-[linear-gradient(140deg,rgba(200,162,200,0.26),rgba(255,255,255,0.94))] p-6 shadow-lifted">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <Badge tone="success">Turno saludable</Badge>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-brand-text">
                La sala se mantiene activa y cocina sigue un ritmo controlado.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-brand-muted">
                Prioriza cobro de mesas pendientes y revision de insumos criticos para sostener el cierre del turno sin cuellos de botella.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3 xl:min-w-[420px] xl:grid-cols-1">
              {[
                ["Ventas del bloque", formatCurrency(684500)],
                ["Mesas por cobrar", `${tableCards.filter((table) => table.status === "pending").length}`],
                ["Tickets listos", `${kitchenTickets.filter((ticket) => ticket.status === "ready").length}`]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[22px] bg-white/92 px-4 py-4 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-muted">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-brand-text">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Ir al POS</Button>
            <Button variant="secondary">Abrir cocina</Button>
            <Button variant="ghost">Revisar stock</Button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">Radar de atencion</p>
              <h2 className="mt-2 text-2xl font-semibold text-brand-text">Lo que requiere accion</h2>
            </div>
            <Badge tone="warning">3 focos</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {[
              {
                title: "Pagos pendientes",
                detail: `${tableCards.filter((table) => table.status === "pending").length} mesas esperan cierre en caja`,
                tone: "warning" as const
              },
              {
                title: "Pedidos en preparacion",
                detail: `${kitchenTickets.filter((ticket) => ticket.status === "preparing").length} tickets activos en cocina`,
                tone: "info" as const
              },
              {
                title: "Ingredientes criticos",
                detail: `${lowStockCount} insumos estan por debajo del minimo`,
                tone: "danger" as const
              }
            ].map((item) => (
              <div key={item.title} className="rounded-[22px] bg-brand-surface/90 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-brand-text">{item.title}</p>
                  <Badge tone={item.tone}>{item.tone}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-brand-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

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
            <Badge tone="info">{occupiedTables.length} activas</Badge>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {tableCards.slice(0, 4).map((table) => (
              <div key={table.id} className="rounded-[24px] bg-brand-surface/85 p-4">
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
              <div key={ticket.id} className="rounded-[24px] bg-brand-surface/85 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-brand-text">{ticket.orderNumber}</p>
                    <p className="text-sm text-brand-muted">{ticket.table}</p>
                  </div>
                  <Badge tone={ticket.status === "pending" ? "warning" : ticket.status === "ready" ? "success" : "info"}>
                    {ticket.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-brand-muted">{ticket.items.map((item) => `${item.qty}x ${item.name}`).join(" / ")}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
