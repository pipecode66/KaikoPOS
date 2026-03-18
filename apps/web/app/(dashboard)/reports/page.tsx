import { Card } from "@/components/ui/card";
import { ScreenHeader } from "@/components/ui/screen-header";
import { formatCurrency } from "@/lib/format";

export default function ReportsPage() {
  const topProducts = [
    ["Capuccino Vainilla", 92, 1150000],
    ["Sandwich Pavo Brie", 67, 1440500],
    ["Croissant Mantequilla", 64, 544000]
  ];

  return (
    <div className="space-y-6">
      <ScreenHeader
        eyebrow="Analitica"
        title="Reportes operativos"
        description="Resumen diario, ventas por metodo, productos lideres y estimacion de costo y utilidad."
        chips={["Ventas netas", "Costo estimado", "Utilidad esperada"]}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Ventas netas", 1845000],
          ["Costo estimado", 628000],
          ["Utilidad estimada", 1217000],
          ["Ordenes pagadas", 86]
        ].map(([label, value]) => (
          <Card key={label} className="p-5">
            <p className="text-sm text-brand-muted">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-brand-text">
              {typeof value === "number" && label !== "Ordenes pagadas" ? formatCurrency(value) : value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <h2 className="text-2xl font-semibold text-brand-text">Ventas por metodo</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Efectivo", 302000],
              ["Tarjeta", 612000],
              ["Transferencia", 931000]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-[18px] bg-brand-surface px-4 py-4">
                <p className="text-brand-muted">{label}</p>
                <p className="font-semibold text-brand-text">{formatCurrency(Number(value))}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-2xl font-semibold text-brand-text">Top productos</h2>
          <div className="mt-5 space-y-3">
            {topProducts.map(([name, qty, sales]) => (
              <div key={name} className="flex items-center justify-between rounded-[18px] bg-brand-surface px-4 py-4">
                <div>
                  <p className="font-medium text-brand-text">{name}</p>
                  <p className="text-sm text-brand-muted">{qty} unidades</p>
                </div>
                <p className="font-semibold text-brand-text">{formatCurrency(Number(sales))}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
