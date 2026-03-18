import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScreenHeader } from "@/components/ui/screen-header";
import { formatCurrency } from "@/lib/format";
import { ingredients } from "@/lib/mock-data";

export default function InventoryPage() {
  const lowStock = ingredients.filter((ingredient) => ingredient.stock <= ingredient.minimum);

  return (
    <div className="space-y-6">
      <ScreenHeader
        eyebrow="Inventario"
        title="Ingredientes y alertas"
        description="Recetas base, stock actual, minimos y trazabilidad para descuento automatico al completar la venta."
        chips={["Minimos visibles", "Costo por unidad", "Base para descuento automatico"]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-brand-muted">Ingredientes activos</p>
          <p className="mt-3 text-3xl font-semibold text-brand-text">{ingredients.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-brand-muted">Alertas criticas</p>
          <p className="mt-3 text-3xl font-semibold text-brand-text">{lowStock.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-brand-muted">Costo estimado promedio</p>
          <p className="mt-3 text-3xl font-semibold text-brand-text">{formatCurrency(4200)}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <h2 className="text-2xl font-semibold text-brand-text">Stock actual</h2>
          <Badge tone="warning">{lowStock.length} por revisar</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-surface text-brand-muted">
              <tr>
                <th className="px-5 py-4 font-medium">Ingrediente</th>
                <th className="px-5 py-4 font-medium">Stock</th>
                <th className="px-5 py-4 font-medium">Minimo</th>
                <th className="px-5 py-4 font-medium">Costo unitario</th>
                <th className="px-5 py-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient) => {
                const isLow = ingredient.stock <= ingredient.minimum;
                return (
                  <tr key={ingredient.id} className="border-t border-black/5">
                    <td className="px-5 py-4 font-medium text-brand-text">{ingredient.name}</td>
                    <td className="px-5 py-4 text-brand-muted">
                      {ingredient.stock} {ingredient.unit}
                    </td>
                    <td className="px-5 py-4 text-brand-muted">
                      {ingredient.minimum} {ingredient.unit}
                    </td>
                    <td className="px-5 py-4 text-brand-muted">{formatCurrency(ingredient.cost)}</td>
                    <td className="px-5 py-4">
                      <Badge tone={isLow ? "warning" : "success"}>
                        {isLow ? "Bajo stock" : "Estable"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
