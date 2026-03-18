import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenHeader } from "@/components/ui/screen-header";
import { cashMovements } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export default function CashRegisterPage() {
  return (
    <div className="space-y-6">
      <ScreenHeader
        eyebrow="Caja"
        title="Apertura, movimientos y cierre"
        description="Seguimiento del turno con monto esperado, conciliacion y totales por metodo de pago."
        actions={<Button>Abrir nuevo turno</Button>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-brand-muted">Fondo inicial</p>
          <p className="mt-3 text-3xl font-semibold text-brand-text">{formatCurrency(250000)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-brand-muted">Monto esperado</p>
          <p className="mt-3 text-3xl font-semibold text-brand-text">{formatCurrency(387500)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-brand-muted">Ventas del turno</p>
          <p className="mt-3 text-3xl font-semibold text-brand-text">{formatCurrency(137500)}</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-brand-text">Movimientos</h2>
            <Badge tone="info">{cashMovements.length} registros</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {cashMovements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between rounded-[18px] bg-brand-surface px-4 py-4">
                <div>
                  <p className="font-medium text-brand-text">{movement.type}</p>
                  <p className="text-sm text-brand-muted">{movement.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brand-text">{formatCurrency(movement.amount)}</p>
                  <p className="text-sm text-brand-muted">{movement.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-2xl font-semibold text-brand-text">Conciliacion</h2>
          <div className="mt-5 rounded-[20px] bg-brand-secondary/45 p-5">
            <div className="flex items-center justify-between text-sm text-brand-muted">
              <span>Efectivo esperado</span>
              <span>{formatCurrency(387500)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-brand-muted">
              <span>Contado manual</span>
              <span>{formatCurrency(385000)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-lg font-semibold text-brand-text">
              <span>Diferencia</span>
              <span>- {formatCurrency(2500)}</span>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              ["Efectivo", 302000],
              ["Tarjeta", 612000],
              ["Transferencia", 931000]
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-[18px] bg-brand-surface px-4 py-4">
                <p className="text-sm text-brand-muted">{label}</p>
                <p className="font-semibold text-brand-text">{formatCurrency(Number(value))}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
