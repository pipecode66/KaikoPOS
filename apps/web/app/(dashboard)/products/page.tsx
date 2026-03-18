import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenHeader } from "@/components/ui/screen-header";
import { products } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <ScreenHeader
        eyebrow="Catalogo"
        title="Productos y categorias"
        description="Gestion base de precios, disponibilidad, notas para cocina y referencias de receta."
        chips={["Disponibilidad", "Precio de venta", "Notas para cocina"]}
        actions={<Button>Nuevo producto</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xl font-semibold text-brand-text">{product.name}</p>
                <p className="mt-1 text-sm text-brand-muted">{product.subtitle}</p>
              </div>
              <Badge tone={product.available ? "success" : "warning"}>
                {product.available ? "Activo" : "Pausado"}
              </Badge>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-lg font-semibold text-brand-text">{formatCurrency(product.price)}</p>
              <Button variant="secondary">Editar</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
